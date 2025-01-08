db.createCollection('users', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'email', 'address'],
            properties: {
                name: {
                    bsonType: 'string',
                    description: 'Name is a required field.'
                },
                email: {
                    bsonType: 'string',
                    description: 'Email is a required field.'
                },
                address: {
                    bsonType: 'object',
                    description: 'Address is a required field.',
                    properties: {
                        street: { bsonType: 'string'},
                        city: { bsonType: 'string'},
                        country: { bsonType: 'string'}
                    }
                },
                gender: { bsonType: 'string'}
            },
            additionalProperties: false
        }
    },
    validationLevel: 'moderate',
    validationAction: 'warn'
})

db.runCommand({collMod: 'users', validator: {
    $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'email', 'address'],
        properties: {
            _id: {bsonType: 'objectId'},
            name: {
                bsonType: 'string',
                description: 'Name is a required field.'
            },
            email: {
                bsonType: 'string',
                description: 'Email is a required field.'
            },
            address: {
                bsonType: 'object',
                description: 'Address is a required field.',
                properties: {
                    street: { bsonType: 'string'},
                    city: { bsonType: 'string'},
                    country: { bsonType: 'string'}
                }
            },
            gender: { bsonType: 'string'}
        },
        additionalProperties: false
    }
}, validationLevel: 'strict', validationAction: 'error'})

db.runCommand({
    collMod: 'users', 
    validationLevel: 'strict', 
    validationAction: 'error'
})

db.countries.insertMany([
    {_id: 'BAN', name: 'Bangladesh'},
    {_id: 'FR', name: 'France'},
    {_id: 'USA', name: 'United States of America'},
], { ordered: false})

db.products.insertOne(
    {name: 'iphone 15', price: 899},
    {writeConcern: {
        w: 0, j: true, wtimeout: 10000
    }}
)

db.products.find({
  $and: [
    {price: {$gt: 50}}, 
    {$or: [
      {category: 'mobile'}, 
      {category: 'laptop'}
    ]}
  ]
})

db.products.find({
  $expr: {
    $gt: [
      {$subtract: ["$price", "$discount"]},
    1000]
  }
})

db.employees.insertMany([
  {
    "name": "John Doe",
    "age": 32,
    "skills": [
      {"name": "tester", "level": 6},
      {"name": "designer", "level": 3}
    ],
    "hobbies": ["sports", "music"]
  },
  {
    "name": "Jane Smith",
    "age": 28,
    "skills": [
      {"name": "developer", "level": 7},
      {"name": "tester", "level": 5}
    ],
    "hobbies": ["cooking", "music"]
  },
  {
    "name": "Michael Johnson",
    "age": 35,
    "skills": [
      {"name": "developer", "level": 5},
      {"name": "designer", "level": 2}
    ],
    "hobbies": ["sports", "movies"]
  }
])

db.employees.find(
  {$and: [
    {"skills.name": "designer"}, 
    {"skills.level": {$gte: 2}}
  ]
})

db.products.find(
  {},
  {
    name: 1, 
    price: 1, 
    ratings: 1, 
    "details.model": 1, 
    "details.color": 1,
    _id:0
  }
)


db.products.find(
  {},
  {
    _id: 0,
    name: true,
    price: 1,
    "details.model": 1,
    "details.color": 1
  }
)

db.employees.find(
  {},
  {name: 1, "skills.name": 1}
)

db.products.find(
  {category: {$all: ["electronics", "laptop"]}}, 
  {name: 1, price: 1, ratings: 1, "category.$": 1}
)

db.products.find(
  {ratings: {$gte: 8}},
  {
    name: 1,
    price: 1,
    ratings: 1,
    _id: 0,
    category: {$elemMatch: {$eq: "laptop"}}
  }
)

db.products.find({},
  {
    name: 1, price: 1, 
    category: {$slice: 2}
  }
)

db.products.find({},
  {
    name: 1, price: 1, 
    category: {$slice: [1, 1]}
  }
)


db.employees.updateMany(
  {"skills.name": "developer"},
  {$set: {isDeveloper: true}}
)

db.products.updateOne(
  {_id: ObjectId('673cd7aa9a01092b92d8404c')},
  {$set: {price: 1399, available: false, discount: 10}}
)

db.products.updateOne(
  {_id: ObjectId('673cd7aa9a01092b92d8403c')},
  {$inc: {price: 200}, $set: {price: 500}}
)

db.employees.updateOne(
  {name: 'John Doe'},
  {$max: {age: 32}}
)

db.products.updateOne(
  {_id: ObjectId('673cd7aa9a01092b92d8404c')},
  {$mul: {discount: 2}}
)

db.employees.updateOne(
  {name: 'John Doe'},
  {$unset: {age: ''}}
)

db.products.updateMany({}, 
  {$rename: {discount: 'totalDiscount'}}
)

db.employees.updateOne(
  {name: 'Steve Smith'},
  {$set: {age: 34, hobbies: ["sports", "running"]}},
  {upsert: true}
)

db.employees.find(
  {$and: [
    {"skills.name": "developer"},
    {"skills.level": {$gt: 6}}
  ]}
)

db.employees.find(
  {skills: {
    $elemMatch: {name: "developer", level: {$gt: 6}}}
  }
)

db.employees.updateMany(
  {skills: {
    $elemMatch: {name: "developer", level: {$gt: 6}}}
  },
  {$set: {"skills.$.expert": true}}
)

db.employees.updateMany(
  {$and: [{age: {$gt: 32}}, {skills: {$exists: true}}]},
  {$inc: {"skills.$[].level": 1}}
)

db.employees.updateMany(
  {"skills.level": {$gte: 6}},
  {$set: {"skills.$[el].expert": true}},
  {arrayFilters: [{"el.level": {$gte: 6}}]}
)

db.employees.updateOne(
  {name: "John SMith"},
  {$addToSet: {skills:{name: 'fullstack', level: 2}}}
)

db.employees.updateOne(
  {name: "John SMith"},
  {$pull: {skills: {name: 'fullstack'}}}
)

db.employees.updateOne(
  {name: "John SMith"},
  {$pop: {skills: 1}}
)

db.employees.deleteMany({
  skills: {$exists: false}
})

db.users.insertOne({
  Name: 'Alice Williams 4',
  Age: 62,
  Gender: 'Female',
  Email: 'alice1.williams.e29d66d5@example.com',
  Location: {
    Street: '8267 High St',
    Country: 'India',
    City: 'Delhi',
    Pin: 679989
  },
  Hobbies: [ 'gaming', 'reading', 'traveling', 'painting' ],
  OtherFields: {
    Occupation: 'Researcher',
    MaritalStatus: 'Married',
    Preferences: { FavoriteColor: 'White', MusicGenre: 'Electronic' }
  }
})

db.users.createIndex(
  {Age: 1},
  {partialFilterExpression: {Gender: 'Male'}}
)

db.employees.insertMany(
  [
    {
      "name": "John Doe",
      "age": 32,
      "skills": [
        {"name": "tester", "level": 6},
        {"name": "designer", "level": 3}
      ],
      "hobbies": ["sports", "music"]
    },
    {
      "name": "Jane Smith",
      "age": 28,
      "skills": [
        {"name": "developer", "level": 7},
        {"name": "tester", "level": 5}
      ],
      "hobbies": ["cooking", "music"]
    },
    {
      "name": "Michael Johnson",
      "age": 35,
      "skills": [
        {"name": "developer", "level": 5},
        {"name": "designer", "level": 2}
      ],
      "hobbies": ["sports", "movies"]
    },
    {
      "name": "Merry Smith",
      "age": 32,
      "skills": [
        {"name": "developer", "level": 6},
        {"name": "tester", "level": 8}
      ],
      "hobbies": ["music", "cooking"]
    },
    {
      "name": "John SMith",
      "age": 32,
      "skills": [
        {"name": "developer", "level": 6},
        {"name": "tester", "level": 8}
      ],
      "hobbies": ["sports", "music", "cooking"]
    }
]
)

db.products.insertMany(
  [
    {
      name: 'Apple smart watch',
      desc: 'An beautiful smart watch with blutooth connectivity',
      price: 1299
    },
    {
      name: 'Sony smart TV',
      desc: 'A mindblowing smart LED TV',
      price: 1299
    },
    {
      name: 'HP Laptop',
      desc: 'A beautiful black HP Laptop',
      price: 1299
    },
    {
      name: 'LG Smart TV',
      desc: 'A mindblowing High Quality LED TV',
      price: 1299
    }
  ]
)

db.products_german.insertMany([
  {
    Name: "Apple Smartwatch",
    desc: "Eine wunderschöne Smartwatch mit Bluetooth-Konnektivität",
    price: 1299
  },
  {
    Name: "Sony Smart TV",
    desc: "Ein umwerfender intelligenter LED-Fernseher",
    price: 1299
  },
  {
    Name: "HP Laptop",
    desc: "Ein wunderschöner schwarzer HP Laptop",
    price: 1299
  },
  {
    Name: "LG Smart TV",
    desc: "Ein umwerfender hochwertiger LED-Fernseher",
    price: 1299
  }
])

db.products_german.createIndex(
  {name: "text", desc: "text"}, 
  {default_language: "german", weight: {name: 1, desc: 10}}
)

db.places.insertMany(
  [
    {
      name: "Kingston Hotel",
      category: "hotel",
      location: {
        type: "Point",
        coordinates: [77.5521751, 13.010281]
      }
    },
    {
      name: "Fabindia, Orion Mall, Malleshwaram",
      category: "mall",
      location: {
        type: "Point",
        coordinates: [77.5495439, 13.0094657]
      }
    },
    {
      name: "Phoenix One Bangalore West",
      category: "mall",
      location: {
        type: "Point",
        coordinates: [77.5500761, 13.0105911]
      }
    },
    {
      name: "Sukriti - The Auspicious Apartment",
      category: "residency",
      location: {
        type: "Point",
        coordinates: [77.5473816, 13.0100083]
      }
    },
    {
      name: "ISKCON temple Bangalore",
      category: "temple",
      location: {
        type: "Point",
        coordinates: [77.55112, 13.00967]
      }
    }
  ]
)

let loc = [77.55082, 13.00766]

db.places.find({location: {
  $near: {
    $geometry: {
      type: "Point",
      coordinates: [77.55082, 13.00766]
    },
    $maxDistance: 300
  }
}})



db.places.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [
          [
            p1, p2, p3, p4, p1 
          ]
        ]
      }
    }
  }
})

const p1 = [77.54868, 13.01133]
const p2 = [77.5552, 13.0114]
const p3 = [77.5549, 13.00839]
const p4 = [77.54795, 13.00868]

const p5 = [77.5522, 13.01077]
const p6 = [77.55628, 13.01048]
const p7 = [77.55728, 13.00877]
const p8 = [77.55218, 13.00753]

db.areas.insertMany([
  {
    name: "Area 1",
    area: {
      type: "Polygon",
      coordinates: [
        [
          p1, p2, p3, p4, p1
        ]
      ]
    }
  },
  {
    name: "area 2",
    area: {
      type: "Polygon",
      coordinates: [
        [
          p5, p6, p7, p8, p5
        ]
      ]
    }
  }
])


db.areas.find({area: {
  $geoIntersects: {
    $geometry: {
      type: "Polygon",
      coordinates: [77.5499, 13.00766]
    }
  }
}})

db.places.find({
  location: {
    $geoWithin: {
      $centerSphere: [
        [77.55117, 13.00829],
        0.2 / 6378.1
      ]
    }
  }
})


db.employees.aggregate([
  {$match: {gender: 'male'}},
  {$group: {_id: {country: "$address.country"}, total: {$sum: 1}}},
  {$sort: {total: -1}}
])

db.employees.aggregate([
  {$project: {
    _id: 0, 
    name: {$concat: [
      {$toUpper: {$substrCP: ['$firstname', 0, 1]}}, 
      {$substrCP: ['$firstname', 1, {$subtract: [{$strLenCP: "$firstname"}, 1]}]},
      " ",
      {$toUpper: {$substrCP: ['$lastname', 0, 1]}}, 
      {$substrCP: ['$lastname', 1, {$subtract: [{$strLenCP: "$lastname"}, 1]}]},
    ]}, 
    gender: 1, 
    email: 1}}
])


db.employees.aggregate([
  {$project: {
    _id: 0, firstname: 1, email: 1, 
    birthDate: {$toDate: "$dob"}
  }},
  {$group: {_id: {birthYear: {$isoWeekYear: "$birthDate"}}, count: {$sum: 1}}},
  {$sort: {count: -1}}
])

db.employees.aggregate([
  {$unwind: "$hobbies"},
  {$group: {_id: 
    {country: "$address.country"},
    allEmpHobbies: {$addToSet: "$hobbies"}  
  }}
])

db.employees.aggregate([
  {$unwind: "$hobbies"}
])

db.employees.aggregate([
  {$project: {
    _id: 0,
    firstname: 1,
    email: 1,
    skills: {$filter: {
      input: "$skills",
      as: "el",
      cond: {$gte: ["$$el.level", 8]}
    }}
  }}
])

db.employees.aggregate([
  {$project: {_id: 0, firstname: 1, birthYear: {$isoWeekYear: {$toDate: "$dob"}}}},
  {$bucket: {
    groupBy: "$birthYear",
    boundaries: [1960, 1970, 1980, 1990, 2000, 2010, 2020],
    output: {
      name: {$push: "$firstname"},
      total: {$sum: 1},
      averageAge: {$avg: {$subtract: [2025, "$birthYear"]}}
    }
  }}
])

db.employees.aggregate([
  {$project: {_id: 0, firstname: 1, birthYear: {$isoWeekYear: {$toDate: "$dob"}}}},
  {$bucketAuto: {
    groupBy: "$birthYear",
    buckets: 5,
    output: {
      name: {$push: "$firstname"},
      total: {$sum: 1},
      averageAge: {$avg: {$subtract: [2025, "$birthYear"]}}
    }
  }}
])

db.employees.aggregate([
  {$project: {_id: 0, firstname: 1, birthDate: {$toDate: "$dob"}}},
  {$sort: {birthDate: 1}},
  {$skip: 20},
  {$limit: 10},
  {$out: "olderpeople"}
])

db.places.aggregate([
  {$geoNear: {
    near: {type: "Point", coordinates: [77.55082, 13.00766]},
    maxDistance: 300,
    distanceField: "distance"
  }}
])

db.users.insertMany([
  {_id: 1, name: "Alice", email: "alice@gmail.com"},
  {_id: 2, name: "Bob", email: "bob@example.com"}
])

db.orders.insertMany([
  {_id: 101, user_id: 1, order_date: '2024-06-17', product_id: "P001"},
  {_id: 102, user_id: 1, order_date: '2024-06-18', product_id: "P002"},
  {_id: 103, user_id: 2, order_date: '2024-06-18', product_id: "P003"}
])

db.products.insertMany([
  {_id: "P001", name: "Laptop", price: 1200},
  {_id: "P002", name: "Mouse", price: 20},
  {_id: "P003", name: "Keyboard", price: 30}
])


db.users.aggregate([
  {$lookup: {
    from: 'orders',
    localField: '_id',
    foreignField: 'user_id',
    as: 'user_orders'
  }},
  {$unwind: '$user_orders'},
  {$lookup: {
    from: 'products',
    localField: 'user_orders.product_id',
    foreignField: '_id',
    as: 'product_details'
  }},
  {$unwind: '$product_details'},
  {$project: {
    _id: 0,
    name: 1,
    email: 1,
    order_id: "$user_orders._id",
    order_date: "$user_orders.order_date",
    product_name: "$product_details.name",
    product_price: "$product_details.price"
  }}
])

db.employees.aggregate([
  {$group: {_id: {country: "$address.country"}}},
  {$count: 'total_employees'}
])

db.students.insertMany([
  {name: 'Alice', score: 85, total: 150},
  {name: 'Bob', score: 72, total: 200}
])

db.students.aggregate([
  {$addFields: {
    score: {$add: ["$score", 5]}
  }}
])



const minInt32 = -2147483648;
const maxInt32 = 2147483647;


db.createUser({
  user: 'john',
  pwd: 'test123',
  roles: [{role: "readWrite", db: "eShopping"}]
})

db.updateUser("john", {
  roles: [
    {role: "readWrite", db: "eShopping"},
    {role: "readWrite", db: "sample"}
  ]
})

db.createRole({
  role: 'ReadWriteNoDelete',
  privileges: [
    {
      resource: {
        db: 'eShopping',
        collection: ""
      },
      actions: ["find", "insert", "update"]
    }
  ],
  roles: []
})

db.createUser({
  user: 'mark',
  pwd: 'test123',
  roles: ["ReadWriteNoDelete"]
})