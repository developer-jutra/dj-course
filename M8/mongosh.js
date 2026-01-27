// https://i.imgflip.com/ai6nn3.jpg

// list all collection names
db.getCollectionNames();

// create a new collection
db.createCollection('incident_logs');

// insert a single document
db.incident_logs.insertOne({
    'what': 'oj dzieje sie!',
    'tags': ['urgent', 'customer-impact'],
});

// fetch all documents from the collection
db.incident_logs.find();

// incorrect way to get document count
db.incident_logs.find().length; // ❌

// correct way to count documents
db.incident_logs.countDocuments(); // ✅

// convert cursor to array to get length
db.incident_logs.find().toArray().length;

// extract tags arrays from all documents
db.incident_logs.find().toArray().map(x => x.tags);

// flatten all tags into a single array
db.incident_logs.find().toArray().flatMap(x => x.tags);

// find all documents in metrics
db.metrics.find({});

// find the first matching document
db.metrics.findOne({});

// find one document and exclude the ID field
db.metrics.findOne({}, { _id: 0 });

// remove all documents from the collection
db.incident_logs.deleteMany({});

// delete the entire collection
db.incident_logs.drop();

// verify collection removal
db.getCollectionNames();

/////////////////////

// MONGOOSE:

// fetch Mongoose document instance without ID
const metrics = await Metric.findOne({}, { _id: 0 });

// fetch plain JavaScript object for better performance
const metrics = await Metric.findOne({}, { _id: 0 }).lean();

// search by string ID (fails if ID is stored as ObjectId)
db.metrics.find({ _id: '69714cd74208108e8ca00aab' });

// search using explicit ObjectId casting
db.metrics.find({ _id: ObjectId('69714cd74208108e8ca00aab') });

// filter by priority and project specific field
db.transportation_requests.find({ priority: "HIGH" }, { vehicleRequirements: 1 });

// filter by high priority
db.transportation_requests.find({ priority: "HIGH" });

// search by nested object property
db.transportation_requests.find({ 'vehicleRequirements.vehicleType': "TRUCK" });

// complex query using OR and nested field matching
db.transportation_requests.find({
  $or: [
    { 
      status: { $in: ["IN_TRANSIT", "DELIVERED"] } 
    },
    { 
      "pickupLocation.address.city": { $eq: "Prague" } 
    }
  ]
});

// get unique values for service type
db.transportation_requests.distinct('serviceType');

// get unique values for nested cargo type
db.transportation_requests.distinct('cargo.cargoType');

// get unique values for nested packaging type
db.transportation_requests.distinct('cargo.packaging');

// list route performance data
db.route_performance.find();

// limit results to first three documents
db.route_performance.find().limit(3);

// sort by revenue ascending and limit
db.route_performance.find().sort({ totalRevenue: 1 }).limit(3);

// sort by revenue descending and limit
db.route_performance.find().sort({ totalRevenue: -1 }).limit(3);

// filter documents in aggregation pipeline
db.recent_requests.aggregate([
  { $match: { type: "Warehousing" } },
]);

// perform left outer join with another collection
db.recent_requests.aggregate([
  { $match: { type: "Warehousing" } },
  {
    $lookup: {
      localField: "id",
      from: "warehousing_requests",
      foreignField: "requestNumber",
      as: "full_details"
    }
  }
]);

// aggregate data to calculate totals per storage type
db.warehousing_requests.aggregate([
  {
    $group: {
      _id: "$storageType",
      totalValue: { $sum: "$cargo.value" },
      itemsCount: { $sum: 1 }
    }
  },
  { $sort: { totalValue: -1 } }
]);

// update specific fields in a single document
db.recent_requests.updateOne(
  { id: 'TR-2024-001' },
  { $set: { status: 'Delivered', updatedAt: new Date() } }
);

// update document or create it if not found
db.recent_requests.updateOne(
  { id: 'TR-2024-099' },
  { 
    $set: { 
      type: 'Transportation',
      status: 'Emergency',
      route: 'Berlin → Paris',
      date: new Date()
    } 
  },
  { upsert: true }
);

// delete a single document by ID
db.recent_requests.deleteOne({ id: 'WH-2024-004' });
