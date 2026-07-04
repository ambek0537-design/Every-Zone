import { prisma, useDbFallback, isMemoryDb } from "../../../../server";
import { CreatePropertyDto, UpdatePropertyDto } from "../dto";

export class PropertyRepository {
  // Utility to generate a unique slug
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);
  }

  async createProperty(dto: CreatePropertyDto) {
    const slug = this.generateSlug(dto.title);

    if (prisma && !useDbFallback) {
      // 1. Create property
      const property = await prisma.property.create({
        data: {
          vendorId: dto.vendorId,
          title: dto.title,
          slug,
          description: dto.description,
          propertyType: dto.propertyType as any,
          listingType: dto.listingType as any,
          status: "DRAFT", // default property status is DRAFT as per requirements
          price: dto.price,
          currency: dto.currency || "ETB",
          bedrooms: dto.bedrooms || null,
          bathrooms: dto.bathrooms || null,
          parkingSpaces: dto.parkingSpaces || null,
          sizeSqm: dto.sizeSqm || null,
          yearBuilt: dto.yearBuilt || null,
          city: dto.city,
          subCity: dto.subCity || null,
          address: dto.address || null,
          latitude: dto.latitude,
          longitude: dto.longitude,
          featured: dto.featured || false,
        },
      });

      // 2. Add Amenities
      if (dto.amenities && dto.amenities.length > 0) {
        await prisma.propertyAmenity.createMany({
          data: dto.amenities.map((amenity) => ({
            propertyId: property.id,
            amenity,
          })),
        });
      }

      // 3. Add Images
      if (dto.images && dto.images.length > 0) {
        await prisma.propertyImage.createMany({
          data: dto.images.map((img) => ({
            propertyId: property.id,
            imageUrl: img.imageUrl,
            sortOrder: img.sortOrder || 0,
            primaryImage: img.primaryImage || false,
          })),
        });
      }

      // 4. Add Videos
      if (dto.videos && dto.videos.length > 0) {
        await prisma.propertyVideo.createMany({
          data: dto.videos.map((vid) => ({
            propertyId: property.id,
            videoUrl: vid.videoUrl,
            thumbnailUrl: vid.thumbnailUrl || null,
          })),
        });
      }

      return this.findById(property.id);
    } else {
      // Memory Fallback
      const propertyId = `prop-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const property = {
        id: propertyId,
        vendorId: dto.vendorId,
        title: dto.title,
        slug,
        description: dto.description,
        propertyType: dto.propertyType,
        listingType: dto.listingType,
        status: "DRAFT" as any,
        price: dto.price,
        currency: dto.currency || "ETB",
        bedrooms: dto.bedrooms || null,
        bathrooms: dto.bathrooms || null,
        parkingSpaces: dto.parkingSpaces || null,
        sizeSqm: dto.sizeSqm || null,
        yearBuilt: dto.yearBuilt || null,
        city: dto.city,
        subCity: dto.subCity || null,
        address: dto.address || null,
        latitude: dto.latitude,
        longitude: dto.longitude,
        featured: dto.featured || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      isMemoryDb.properties.push(property);

      // Add Amenities
      if (dto.amenities && dto.amenities.length > 0) {
        dto.amenities.forEach((amenity) => {
          isMemoryDb.propertyAmenities.push({
            id: `amen-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            propertyId,
            amenity,
          });
        });
      }

      // Add Images
      if (dto.images && dto.images.length > 0) {
        dto.images.forEach((img) => {
          isMemoryDb.propertyImages.push({
            id: `img-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            propertyId,
            imageUrl: img.imageUrl,
            sortOrder: img.sortOrder || 0,
            primaryImage: img.primaryImage || false,
          });
        });
      }

      // Add Videos
      if (dto.videos && dto.videos.length > 0) {
        dto.videos.forEach((vid) => {
          isMemoryDb.propertyVideos.push({
            id: `vid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            propertyId,
            videoUrl: vid.videoUrl,
            thumbnailUrl: vid.thumbnailUrl || null,
          });
        });
      }

      return this.findById(propertyId);
    }
  }

  async findById(id: string) {
    if (prisma && !useDbFallback) {
      const property = await prisma.property.findUnique({
        where: { id },
      });
      if (!property) return null;

      const [images, videos, amenities] = await Promise.all([
        prisma.propertyImage.findMany({ where: { propertyId: id }, orderBy: { sortOrder: "asc" } }),
        prisma.propertyVideo.findMany({ where: { propertyId: id } }),
        prisma.propertyAmenity.findMany({ where: { propertyId: id } }),
      ]);

      return {
        ...property,
        images,
        videos,
        amenities: amenities.map((a) => a.amenity),
      };
    } else {
      const property = isMemoryDb.properties.find((p: any) => p.id === id);
      if (!property) return null;

      const images = isMemoryDb.propertyImages
        .filter((img: any) => img.propertyId === id)
        .sort((a: any, b: any) => a.sortOrder - b.sortOrder);
      const videos = isMemoryDb.propertyVideos.filter((vid: any) => vid.propertyId === id);
      const amenities = isMemoryDb.propertyAmenities.filter((a: any) => a.propertyId === id);

      return {
        ...property,
        images,
        videos,
        amenities: amenities.map((a: any) => a.amenity),
      };
    }
  }

  async findBySlug(slug: string) {
    if (prisma && !useDbFallback) {
      const property = await prisma.property.findUnique({
        where: { slug },
      });
      if (!property) return null;
      return this.findById(property.id);
    } else {
      const property = isMemoryDb.properties.find((p: any) => p.slug === slug);
      if (!property) return null;
      return this.findById(property.id);
    }
  }

  async updateProperty(id: string, dto: UpdatePropertyDto) {
    if (prisma && !useDbFallback) {
      const property = await prisma.property.update({
        where: { id },
        data: {
          ...dto,
          updatedAt: new Date(),
        } as any,
      });
      return this.findById(property.id);
    } else {
      const property = isMemoryDb.properties.find((p: any) => p.id === id);
      if (!property) throw new Error("Property not found");

      Object.assign(property, dto);
      property.updatedAt = new Date();
      return this.findById(id);
    }
  }

  async deleteProperty(id: string) {
    if (prisma && !useDbFallback) {
      // Cascade delete manually just to ensure references are removed cleanly
      await Promise.all([
        prisma.propertyImage.deleteMany({ where: { propertyId: id } }),
        prisma.propertyVideo.deleteMany({ where: { propertyId: id } }),
        prisma.propertyAmenity.deleteMany({ where: { propertyId: id } }),
        prisma.propertyInquiry.deleteMany({ where: { propertyId: id } }),
        prisma.propertyVisit.deleteMany({ where: { propertyId: id } }),
      ]);
      return prisma.property.delete({
        where: { id },
      });
    } else {
      const index = isMemoryDb.properties.findIndex((p: any) => p.id === id);
      if (index === -1) throw new Error("Property not found");

      isMemoryDb.propertyImages = isMemoryDb.propertyImages.filter((img: any) => img.propertyId !== id);
      isMemoryDb.propertyVideos = isMemoryDb.propertyVideos.filter((vid: any) => vid.propertyId !== id);
      isMemoryDb.propertyAmenities = isMemoryDb.propertyAmenities.filter((a: any) => a.propertyId !== id);
      isMemoryDb.propertyInquiries = isMemoryDb.propertyInquiries.filter((inq: any) => inq.propertyId !== id);
      isMemoryDb.propertyVisits = isMemoryDb.propertyVisits.filter((vis: any) => vis.propertyId !== id);

      const deleted = isMemoryDb.properties.splice(index, 1)[0];
      return deleted;
    }
  }

  // --- Search and Filters ---
  async searchProperties(filters: {
    city?: string;
    subCity?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    listingType?: string;
    minArea?: number;
    maxArea?: number;
    parking?: boolean;
    featured?: boolean;
    status?: string;
  }) {
    if (prisma && !useDbFallback) {
      const where: any = {};

      // SOLD properties are hidden from search (as per Business Rules)
      // RENTED properties remain visible but might be filtered if we only want active ones.
      // By default, search active/rented. Explicitly exclude SOLD.
      where.status = { not: "SOLD" };

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.city) where.city = { contains: filters.city, mode: "insensitive" };
      if (filters.subCity) where.subCity = { contains: filters.subCity, mode: "insensitive" };

      if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) where.price.gte = filters.minPrice;
        if (filters.maxPrice) where.price.lte = filters.maxPrice;
      }

      if (filters.bedrooms) where.bedrooms = filters.bedrooms;
      if (filters.bathrooms) where.bathrooms = filters.bathrooms;
      if (filters.propertyType) where.propertyType = filters.propertyType;
      if (filters.listingType) where.listingType = filters.listingType;

      if (filters.minArea || filters.maxArea) {
        where.sizeSqm = {};
        if (filters.minArea) where.sizeSqm.gte = filters.minArea;
        if (filters.maxArea) where.sizeSqm.lte = filters.maxArea;
      }

      if (filters.parking) {
        where.parkingSpaces = { gte: 1 };
      }

      if (filters.featured !== undefined) {
        where.featured = filters.featured;
      }

      const list = await prisma.property.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      // Hydrate with relations
      return Promise.all(list.map((p) => this.findById(p.id)));
    } else {
      // Memory Fallback Search
      let list = [...isMemoryDb.properties];

      // Rule: SOLD properties are strictly hidden from search
      list = list.filter((p: any) => p.status !== "SOLD");

      if (filters.status) {
        list = list.filter((p: any) => p.status === filters.status);
      }

      if (filters.city) {
        list = list.filter((p: any) => p.city.toLowerCase().includes(filters.city!.toLowerCase()));
      }
      if (filters.subCity) {
        list = list.filter((p: any) => p.subCity && p.subCity.toLowerCase().includes(filters.subCity!.toLowerCase()));
      }

      if (filters.minPrice !== undefined) {
        list = list.filter((p: any) => Number(p.price) >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        list = list.filter((p: any) => Number(p.price) <= filters.maxPrice!);
      }

      if (filters.bedrooms !== undefined) {
        list = list.filter((p: any) => p.bedrooms === filters.bedrooms);
      }
      if (filters.bathrooms !== undefined) {
        list = list.filter((p: any) => p.bathrooms === filters.bathrooms);
      }
      if (filters.propertyType) {
        list = list.filter((p: any) => p.propertyType === filters.propertyType);
      }
      if (filters.listingType) {
        list = list.filter((p: any) => p.listingType === filters.listingType);
      }

      if (filters.minArea !== undefined) {
        list = list.filter((p: any) => p.sizeSqm && p.sizeSqm >= filters.minArea!);
      }
      if (filters.maxArea !== undefined) {
        list = list.filter((p: any) => p.sizeSqm && p.sizeSqm <= filters.maxArea!);
      }

      if (filters.parking) {
        list = list.filter((p: any) => p.parkingSpaces && p.parkingSpaces >= 1);
      }

      if (filters.featured !== undefined) {
        list = list.filter((p: any) => p.featured === filters.featured);
      }

      list.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());

      return Promise.all(list.map((p: any) => this.findById(p.id)));
    }
  }

  // --- Add/Delete Images, Videos & Amenities ---
  async addImage(propertyId: string, imageUrl: string, sortOrder = 0, primaryImage = false) {
    if (prisma && !useDbFallback) {
      return prisma.propertyImage.create({
        data: { propertyId, imageUrl, sortOrder, primaryImage },
      });
    } else {
      const img = {
        id: `img-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        propertyId,
        imageUrl,
        sortOrder,
        primaryImage,
      };
      isMemoryDb.propertyImages.push(img);
      return img;
    }
  }

  async addVideo(propertyId: string, videoUrl: string, thumbnailUrl?: string) {
    if (prisma && !useDbFallback) {
      return prisma.propertyVideo.create({
        data: { propertyId, videoUrl, thumbnailUrl: thumbnailUrl || null },
      });
    } else {
      const vid = {
        id: `vid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        propertyId,
        videoUrl,
        thumbnailUrl: thumbnailUrl || null,
      };
      isMemoryDb.propertyVideos.push(vid);
      return vid;
    }
  }

  // --- Property Inquiries ---
  async createInquiry(propertyId: string, buyerId: string, message: string) {
    if (prisma && !useDbFallback) {
      return prisma.propertyInquiry.create({
        data: {
          propertyId,
          buyerId,
          message,
          status: "PENDING",
        },
      });
    } else {
      const inquiry = {
        id: `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        propertyId,
        buyerId,
        message,
        status: "PENDING",
        createdAt: new Date(),
      };
      isMemoryDb.propertyInquiries.push(inquiry);
      return inquiry;
    }
  }

  async getInquiriesByProperty(propertyId: string) {
    if (prisma && !useDbFallback) {
      return prisma.propertyInquiry.findMany({
        where: { propertyId },
        orderBy: { createdAt: "desc" },
      });
    } else {
      return isMemoryDb.propertyInquiries
        .filter((inq: any) => inq.propertyId === propertyId)
        .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }

  async getInquiriesByBuyer(buyerId: string) {
    if (prisma && !useDbFallback) {
      return prisma.propertyInquiry.findMany({
        where: { buyerId },
        orderBy: { createdAt: "desc" },
      });
    } else {
      return isMemoryDb.propertyInquiries
        .filter((inq: any) => inq.buyerId === buyerId)
        .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }

  async getInquiriesByVendor(vendorId: string) {
    // Collect all inquiries for any properties owned by this vendor
    if (prisma && !useDbFallback) {
      const properties = await prisma.property.findMany({ where: { vendorId }, select: { id: true } });
      const propertyIds = properties.map((p) => p.id);
      return prisma.propertyInquiry.findMany({
        where: { propertyId: { in: propertyIds } },
        orderBy: { createdAt: "desc" },
      });
    } else {
      const properties = isMemoryDb.properties.filter((p: any) => p.vendorId === vendorId);
      const propertyIds = properties.map((p: any) => p.id);
      return isMemoryDb.propertyInquiries
        .filter((inq: any) => propertyIds.includes(inq.propertyId))
        .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }

  // --- Property Visits ---
  async createVisitBooking(propertyId: string, buyerId: string, visitDate: Date, note?: string) {
    if (prisma && !useDbFallback) {
      return prisma.propertyVisit.create({
        data: {
          propertyId,
          buyerId,
          visitDate,
          status: "PENDING",
          note: note || null,
        },
      });
    } else {
      const visit = {
        id: `vis-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        propertyId,
        buyerId,
        visitDate,
        status: "PENDING",
        note: note || null,
      };
      isMemoryDb.propertyVisits.push(visit);
      return visit;
    }
  }

  async getVisitsByVendor(vendorId: string) {
    if (prisma && !useDbFallback) {
      const properties = await prisma.property.findMany({ where: { vendorId }, select: { id: true } });
      const propertyIds = properties.map((p) => p.id);
      return prisma.propertyVisit.findMany({
        where: { propertyId: { in: propertyIds } },
        orderBy: { visitDate: "asc" },
      });
    } else {
      const properties = isMemoryDb.properties.filter((p: any) => p.vendorId === vendorId);
      const propertyIds = properties.map((p: any) => p.id);
      return isMemoryDb.propertyVisits
        .filter((v: any) => propertyIds.includes(v.propertyId))
        .sort((a: any, b: any) => a.visitDate.getTime() - b.visitDate.getTime());
    }
  }

  async getVisitsByBuyer(buyerId: string) {
    if (prisma && !useDbFallback) {
      return prisma.propertyVisit.findMany({
        where: { buyerId },
        orderBy: { visitDate: "asc" },
      });
    } else {
      return isMemoryDb.propertyVisits
        .filter((v: any) => v.buyerId === buyerId)
        .sort((a: any, b: any) => a.visitDate.getTime() - b.visitDate.getTime());
    }
  }

  async updateVisitStatus(visitId: string, status: string) {
    if (prisma && !useDbFallback) {
      return prisma.propertyVisit.update({
        where: { id: visitId },
        data: { status },
      });
    } else {
      const visit = isMemoryDb.propertyVisits.find((v: any) => v.id === visitId);
      if (!visit) throw new Error("Visit booking not found");
      visit.status = status;
      return visit;
    }
  }

  async getPropertiesByVendor(vendorId: string) {
    if (prisma && !useDbFallback) {
      const list = await prisma.property.findMany({
        where: { vendorId },
        orderBy: { createdAt: "desc" },
      });
      return Promise.all(list.map((p) => this.findById(p.id)));
    } else {
      const list = isMemoryDb.properties.filter((p: any) => p.vendorId === vendorId);
      list.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
      return Promise.all(list.map((p: any) => this.findById(p.id)));
    }
  }

  async getAllProperties() {
    if (prisma && !useDbFallback) {
      const list = await prisma.property.findMany({
        orderBy: { createdAt: "desc" },
      });
      return Promise.all(list.map((p) => this.findById(p.id)));
    } else {
      const list = [...isMemoryDb.properties];
      list.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
      return Promise.all(list.map((p: any) => this.findById(p.id)));
    }
  }
}
