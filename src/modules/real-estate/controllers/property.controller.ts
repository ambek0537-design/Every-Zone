import { Router, Request, Response } from "express";
import { PropertyService } from "../services/property.service";

const service = new PropertyService();

export const propertyRouter = Router();

// =========================================================================
// 1. PUBLIC PROPERTY APIS
// =========================================================================

// GET /properties/search
propertyRouter.get("/search", async (req: Request, res: Response) => {
  try {
    const filters = {
      city: req.query.city as string,
      subCity: req.query.subCity as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      bedrooms: req.query.bedrooms ? Number(req.query.bedrooms) : undefined,
      bathrooms: req.query.bathrooms ? Number(req.query.bathrooms) : undefined,
      propertyType: req.query.propertyType as string,
      listingType: req.query.listingType as string,
      minArea: req.query.minArea ? Number(req.query.minArea) : undefined,
      maxArea: req.query.maxArea ? Number(req.query.maxArea) : undefined,
      parking: req.query.parking === "true",
      featured: req.query.featured === "true" ? true : undefined,
      status: req.query.status as string,
    };

    const properties = await service.searchProperties(filters);
    return res.status(200).json({ status: "success", properties });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /properties
propertyRouter.get("/", async (req: Request, res: Response) => {
  try {
    const filters = {
      city: req.query.city as string,
      subCity: req.query.subCity as string,
      propertyType: req.query.propertyType as string,
      listingType: req.query.listingType as string,
      featured: req.query.featured === "true" ? true : undefined,
      status: "ACTIVE", // public properties default to active
    };
    const properties = await service.searchProperties(filters);
    return res.status(200).json({ status: "success", properties });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /properties/:slug
propertyRouter.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const property = await service.getPropertyBySlug(slug);
    if (!property) {
      return res.status(404).json({ error: "Property listing not found" });
    }
    return res.status(200).json({ status: "success", property });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /properties
propertyRouter.post("/", async (req: Request, res: Response) => {
  try {
    const {
      vendorId,
      title,
      description,
      propertyType,
      listingType,
      price,
      currency,
      bedrooms,
      bathrooms,
      parkingSpaces,
      sizeSqm,
      yearBuilt,
      city,
      subCity,
      address,
      latitude,
      longitude,
      featured,
      amenities,
      images,
      videos,
    } = req.body;

    if (!vendorId || !title || !description || !propertyType || !listingType || price === undefined || !city) {
      return res.status(400).json({
        error: "Missing required listing parameters: vendorId, title, description, propertyType, listingType, price, city.",
      });
    }

    const property = await service.createProperty({
      vendorId,
      title,
      description,
      propertyType,
      listingType,
      price: Number(price),
      currency,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      parkingSpaces: parkingSpaces ? Number(parkingSpaces) : undefined,
      sizeSqm: sizeSqm ? Number(sizeSqm) : undefined,
      yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
      city,
      subCity,
      address,
      latitude: Number(latitude),
      longitude: Number(longitude),
      featured: !!featured,
      amenities,
      images,
      videos,
    });

    return res.status(201).json({ status: "success", property });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// PATCH /properties/:id
propertyRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vendorId } = req.body; // vendor must authorize
    if (!vendorId) {
      return res.status(400).json({ error: "vendorId is required to modify this listing." });
    }

    const updated = await service.updateProperty(id, vendorId, req.body);
    return res.status(200).json({ status: "success", property: updated });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// DELETE /properties/:id
propertyRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vendorId } = req.body;
    if (!vendorId) {
      return res.status(400).json({ error: "vendorId is required to delete this listing." });
    }

    await service.deleteProperty(id, vendorId);
    return res.status(200).json({ status: "success", message: "Property listing deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /properties/:id/images
propertyRouter.post("/:id/images", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { imageUrl, sortOrder, primaryImage } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required." });
    }
    const image = await service.addImage(id, imageUrl, sortOrder ? Number(sortOrder) : undefined, !!primaryImage);
    return res.status(200).json({ status: "success", image });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /properties/:id/videos
propertyRouter.post("/:id/videos", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { videoUrl, thumbnailUrl } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ error: "videoUrl is required." });
    }
    const video = await service.addVideo(id, videoUrl, thumbnailUrl);
    return res.status(200).json({ status: "success", video });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /properties/:id/inquiry
propertyRouter.post("/:id/inquiry", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { buyerId, message } = req.body;
    if (!buyerId || !message) {
      return res.status(400).json({ error: "Missing inquiry parameters: buyerId, message." });
    }
    const inquiry = await service.createInquiry(id, buyerId, message);
    return res.status(201).json({ status: "success", inquiry });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /properties/:id/visit
propertyRouter.post("/:id/visit", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { buyerId, visitDate, note } = req.body;
    if (!buyerId || !visitDate) {
      return res.status(400).json({ error: "Missing visit parameters: buyerId, visitDate." });
    }
    const visit = await service.createVisitBooking(id, buyerId, visitDate, note);
    return res.status(201).json({ status: "success", visit });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});


// =========================================================================
// 2. VENDOR DASHBOARD APIS
// =========================================================================
export const vendorPropertyRouter = Router();

// GET /vendor/real-estate/dashboard
vendorPropertyRouter.get("/dashboard", async (req: Request, res: Response) => {
  try {
    const vendorId = (req.query.vendorId as string) || "u-1"; // default vendor
    const stats = await service.getVendorDashboardStats(vendorId);
    return res.status(200).json({ status: "success", ...stats });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /vendor/real-estate/properties
vendorPropertyRouter.get("/properties", async (req: Request, res: Response) => {
  try {
    const vendorId = (req.query.vendorId as string) || "u-1";
    const properties = await service.getPropertiesByVendor(vendorId);
    return res.status(200).json({ status: "success", properties });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /vendor/real-estate/inquiries
vendorPropertyRouter.get("/inquiries", async (req: Request, res: Response) => {
  try {
    const vendorId = (req.query.vendorId as string) || "u-1";
    const inquiries = await service.getInquiriesByVendor(vendorId);
    return res.status(200).json({ status: "success", inquiries });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /vendor/real-estate/visits
vendorPropertyRouter.get("/visits", async (req: Request, res: Response) => {
  try {
    const vendorId = (req.query.vendorId as string) || "u-1";
    const visits = await service.getVisitsByVendor(vendorId);
    return res.status(200).json({ status: "success", visits });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /vendor/real-estate/visits/:id (Accept/Reject visit bookings)
vendorPropertyRouter.patch("/visits/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "APPROVED", "REJECTED", "COMPLETED"
    if (!status) {
      return res.status(400).json({ error: "status parameter is required." });
    }
    const updated = await service.updateVisitStatus(id, status);
    return res.status(200).json({ status: "success", visit: updated });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});


// =========================================================================
// 3. ADMIN APIS
// =========================================================================
export const adminPropertyRouter = Router();

// GET /admin/real-estate/dashboard
adminPropertyRouter.get("/dashboard", async (req: Request, res: Response) => {
  try {
    const stats = await service.getAdminDashboardStats();
    return res.status(200).json({ status: "success", ...stats });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /admin/real-estate/properties/:id (Approve, reject, suspend properties)
adminPropertyRouter.patch("/properties/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, featured } = req.body;
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (featured !== undefined) updateData.featured = !!featured;

    const property = await service.updateProperty(id, "u-1", updateData); // bypass check or pass generic owner
    return res.status(200).json({ status: "success", property });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});
