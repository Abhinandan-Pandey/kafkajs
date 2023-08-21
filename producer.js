const ip = require('ip')

const { Kafka, CompressionTypes, logLevel } = require('kafkajs')

const host = process.env.HOST_IP || ip.address()

const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${host}:9092`],
  clientId: 'example-producer',
})

// const topic = 'topic-test'
// const topic = "fynd-json-mdh-webhook-jiopim-price-event";
// const topic = "fynd-json-mdh-webhook-sandstorm-inventory-event";
// const topic = "mdh-webhook-littleboy-product-event";
// const topic = "mdh-webhook-ajio-b2b-event";
// const topic = "mdh-webhook-ajio-b2c-event";
// const topic = "mdh-webhook-infibeam-b2b-event";
// const topic = "mdh-webhook-infibeam-b2c-event";
const topic = 'fynd-json-mdh-webhook-jiopim-category-event';

const producer = kafka.producer()

const getRandomNumber = () => Math.round(Math.random(10) * 1000)
const createMessage = num => ({
  key: `key-${num}`,
  value: ` abhinandan panday,  value-${num}-${new Date().toISOString()}`,
})

const sendMessage = () => {
  return producer
    .send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: [
        // { value: JSON.stringify([price_message]) },
        // { value: JSON.stringify([inventory_message]) }
        // { value: JSON.stringify([category_message]) }
        { value: JSON.stringify([littleboy_message]) }
      ],
    })
    .then((result) => console.log("data is sent", result))
    .catch(e => console.error(`[example/producer] ${e.message}`, e))
}

const run = async () => {
  await producer.connect()
  setInterval(sendMessage, 5000)
}

run().catch(e => console.error(`[example/producer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async () => {
    try {
      console.log(`process.on ${type}`)
      await producer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await producer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})
const inventory_message = {
  "payload": {
    "inventory": [
      {
        "article": "47864",
        "storeid": "Kurla",
        "available": true,
        "tenant": 89034345678
      },
      {
        "article": "10321",
        "storeid": "kandivali",
        "available": true,
        "tenant": 89034
      }
    ]
  },
  "meta": {
    "event": {
      "name": "inventory",
      "source": "sandstorm",
      "version": "1"
    },
    "organization_id": 2,
    "trace_id": [
      "mdh-data-ingestion-layer.76e7fbf4-4817-4eca-bde0-2e430f68c598"
    ],
    "created_timestamp": 1681131185158,
    "service": {
      "name": "mdh-data-ingestion-layer"
    }
  }
}

const price_message = {
  "payload": {
    "price": [
      {
        "mrp": 38,
        "tag": null,
        "price": 12,
        "discount": 12,
        "available": true,
        "seller_id": 67466,
        "deal_price": null,
        "action_type": "update",
        "discount_pt": 51,
        "region_code": "TG567",
        "seller_name": "Reliance Retail",
        "product_code": 89034345678,
        "weight_range": null,
        "discount_rate": 0.51,
        "vertical_code": "GROCERIES",
        "max_qty_in_order": 2,
        "promo_description": null,
        "max_exchange_amount": null,
        "alternate_product_code": "48765"
      },
      {
        "mrp": 20,
        "tag": null,
        "price": 20,
        "discount": 8,
        "available": true,
        "seller_id": 6746,
        "deal_price": null,
        "action_type": "update",
        "discount_pt": 51,
        "region_code": "TG59",
        "seller_name": "Reliance Retail",
        "product_code": 8043,
        "weight_range": null,
        "discount_rate": 0.51,
        "vertical_code": "GROCERIES",
        "max_qty_in_order": 2,
        "promo_description": null,
        "max_exchange_amount": null,
        "alternate_product_code": "491110858"
      }
    ]
  },
  "meta": {
    "event": {
      "name": "price",
      "source": "jiopim",
      "version": "1"
    },
    "organization_id": 1,
    "trace_id": [
      "mdh-data-ingestion-layer.e172bbd2-a497-41fc-a3bf-74d5a41bff65"
    ],
    "created_timestamp": 1680441655726,
    "service": {
      "name": "mdh-data-ingestion-layer"
    }
  }
}
const category_message = {
  "payload": {
    "category": [
      {
        "id": 332,
        "hierarchy": "1-3-499-500",
        "name": "Track Pants",
        "url_path": "c/fashion/boys/western-wear/track-pants/501",
        "description": "sd",
        "parent_id": 3,
        "category_type": "O",
        "is_active": 1,
        "level": 44,
        "level_name": "BRICK",
        "level_code": "830501014",
        "position": 0,
        "type": "main",
        "vertical_code": "FASHION",
        "masthead_image_path": "images/category/501/track-pants-20200831.jpg",
        "thumbnail_image_path": "images/category/501/thumb/track-pants-20230416.png",
        "source_id": "home_fash_boys_west_tr15542850",
        "source_name": "INFIBEAM",
        "logo_image_path": null,
        "masthead_image_original_path": null,
        "thumbnail_image_original_path": null,
        "code": null,
        "facet_order": null,
        "pushed_json": {},
        "meta_title": null,
        "meta_description": null,
        "header": "",
        "do_algolia_sync": null,
        "user": null,
        "updated_time": 1681646257000,
        "created_time": 1596882358000
      }
    ]
  },
  "meta": {
    "event": {
      "name": "category",
      "source": "jiopim",
      "version": "1"
    },
    "organization_id": 2,
    "trace_id": [
      "mdh-data-ingestion-layer.2538097813e9ab924b2044fb16655e9d"
    ],
    "created_timestamp": 1685439002196,
    "service": {
      "name": "mdh-data-ingestion-layer"
    }
  }
}
const littleboy_message = {
  "payload": {
    "product": {
      "itemCode": 948475,
      "itemName": "Miss Claire Glimmersticks For Lips L-26 Sharbat Pink 1.8 Gm",
      "availabilityStatus": "A",
      "activeStatus": true,
      "productType": "O",
      "schedule": "M",
      "itemType": "PENCIL",
      "packageType": "Pencil",
      "packSize": "1.8",
      "packSizeUnit": "gm",
      "dosage": "0",
      "dosageUnit": "",
      "cartMinQty": 1,
      "cartMaxQty": 5,
      "productURL": "miss-claire-glimmersticks-for-lips-l-26-sharbat-pink-1-8-gm",
      "searchKeys": "lip liner pencil",
      "inventroyLookup": "Y",
      "refundStatus": "Y",
      "coldStorage": "N",
      "dpcoStatus": "N",
      "foodLabel": "N",
      "eanCode": "8903487015524",
      "boxQty": 0,
      "unitSaleFlag": "N",
      "onlineSaleStatus": "Both",
      "unitCount": 1,
      "procuredBy": "Beauty",
      "popularity": "0",
      "brandOrGeneric": "",
      "refillStatus": "",
      "createdDate": "5/25/2021 11:34:43 AM",
      "modifiedDate": "1/19/2023 9:06:05 AM",
      "requestBy": "Brand",
      "isAllowPayment": "Y",
      "catalogVisibility": true,
      "searchVisibility": true,
      "releaseTypeName": "",
      "countryOrgin": "China",
      "fssaiNo": "",
      "otxFlag": false,
      "isVegItem": " ",
      "boxPackQty": null,
      "cartonQty": null,
      "intakeShelfLife": null,
      "vendorNonReturnable": " ",
      "sapCode": "492492943",
      "inventoryMaxQty": null,
      "inventoryMinQty": null,
      "shortExpiry": null,
      "dlFlag": false,
      "truuthFlag": false,
      "recommQty": null,
      "itemShelfLife": null,
      "isFssaiApplicable": " ",
      "isInflammable": "N",
      "dpcoDiscountFlag": "N",
      "inventoryLeastExpDate": "1/31/2026 12:00:00 AM",
      "brandColour": "Pink",
      "optionCode": "6063_pink",
      "verticalSpecification": "BEAUTY",
      "b2bAttributes": {
        "marginPercentage": 0,
        "isActive": true,
        "ptrPercentage": 0,
        "ptrPercentageType": "",
        "minimumQty": 1,
        "maximumQty": 999999,
        "defaultQty": 1,
        "minMargin": 12,
        "unitSaleFlag": "N",
        "unitCount": 1
      },
      "dimensions": {
        "productRating": 0,
        "productWeight": 1.8,
        "productSize": "",
        "productHeight": 1200,
        "productWidth": 400,
        "productLength": 400
      },
      "brandDetails": {
        "brandId": 119826,
        "brandName": "Miss Claire Glimmersticks for Lips L-26 Sharbat Pink",
        "brandFilter": "Miss Claire",
        "brandGroupName": ""
      },
      "itemPriceDetails": {
        "mrp": 65,
        "itemDiscount": 0.25,
        "dpcoCeilingMrp": 0,
        "flatDiscount": 0,
        "brandDiscount": 0
      },
      "genericDetails": {
        "genericName": "Lips",
        "genericDosage": "Lips",
        "genericNameWithDosage": "Lips"
      },
      "marketerDetails": {
        "marketerId": "4833",
        "marketerName": "Eureka Cosmo Pvt Ltd",
        "marketerAddress": "NA",
        "divisionName": "Eureka Cosmo Pvt Ltd"
      },
      "manufactureDetails": {
        "manufactureId": "3",
        "manufactureName": "NA",
        "manufactureAddress": "NA"
      },
      "importerDetails": {
        "importerName": "",
        "importerAddress": ""
      },
      "cimisCateogryDetails": {
        "cimsCategoryName": "OTC",
        "cimsClassification": "OTC",
        "cimsSubCategoryName": "OTC"
      },
      "taxDetails": {
        "hsnCode": "33041000",
        "taxPercentage": "18P"
      },
      "similarProducts": [],
      "alternateProducts": [],
      "boughtTogetherProducts": [],
      "additionalInformation": {
        "netQty": "",
        "shelfLife": "NA",
        "unitsInKit": "",
        "ingredients": "",
        "vegOrNonVeg": "",
        "nutritionInfo": "",
        "customerCareNo": "+91-7200712345",
        "itemDimensions": "NA",
        "certificationNo": "",
        "directionsToUse": "",
        "safetyPrecaution": "",
        "customerCareEmail": "",
        "productsInsideKit": "",
        "guaranteesOrWarranties": "",
        "certificationApplicable": ""
      },
      "seoContent": {
        "seoTittle": "Buy Miss Claire Glimmersticks for Lips L-26 Sharbat Pink 1.8 gm Online at Best Price - Beauty L3",
        "seoMetaDescription": "Shop Miss Claire Glimmersticks for Lips L-26 Sharbat Pink 1.8 gm Online at a low price. Search personal care, ayurvedic, homeopathy, baby & mother care, fitness supplements and healthcare devices from Netmeds. Order and get doorstep delivery anywhere in India.",
        "seoMetaKeywords": "Miss Claire Glimmersticks for Lips L-26 Sharbat Pink 1.8 gm,Beauty L1 OTC products, Over the Counter Products, Health Care, OTC, Online Pharmacy India, Medicine Online, Online Medicine Beauty L2 Beauty L3"
      },
      "itemContent": [
        {
          "key": "Description",
          "value": "Get that pout right with Miss Claire’s Glimmersticks for lips to achieve an enhanced, smooth look without dullness. The unique, soft texture of the non-drying formula glides over every curve with ease to create a fuller look. These subtle glimmer sticks have a superior staying power and offer a waterproof formula that blends easily and provides great definition to your lips for a lasting effect."
        },
        {
          "key": "Key Benefit",
          "value": ""
        },
        {
          "key": "Direction For Use",
          "value": "Step1: Ensure the tip of the pencil is sharp for precise application\nStep2: Apply first to the outer lines of lips to create the perfect contour\nStep3: Gradually fill in color all over lips to create the perfect lip fill\nStep4: You can increase the strokes as per the intensity you desire\n"
        },
        {
          "key": "Safety Information",
          "value": ""
        },
        {
          "key": "Other Information",
          "value": ""
        }
      ],
      "productCategory": [
        {
          "categoryIdLevel1": 3431,
          "categoryNameLevel1": "Make-Up",
          "categoryImageLevel1": "https://www.netmeds.com/images/category/v1/3431/make_up.jpg",
          "categoryThumbImageLevel1": "https://www.netmeds.com/images/category/prod/thumb/make-up.png",
          "categoryIdLevel2": 3432,
          "categoryNameLevel2": "Lips",
          "categoryImageLevel2": "https://www.netmeds.com/images/category/v1/3432/lips.jpg",
          "categoryThumbImageLevel2": "https://www.netmeds.com/images/category/prod/thumb/lips.png",
          "categoryIdLevel3": 3433,
          "categoryNameLevel3": "Lipsticks",
          "categoryImageLevel3": "https://www.netmeds.com/images/category/v1/3433/lipsticks.jpg",
          "categoryThumbImageLevel3": "https://www.netmeds.com/images/category/v1/3433/thumb/lipsticks_200.jpg",
          "defaultCategory": "Y"
        }
      ],
      "productImageUrl": [
        {
          "imageUrl": "https://www.netmeds.com/images/product-v1/600x600/948475/miss_claire_glimmersticks_for_lips_l_26_sharbat_pink_1_8_gm_229279_0_2.jpg",
          "priorityLevel": 0
        },
        {
          "imageUrl": "https://www.netmeds.com/images/product-v1/600x600/948475/miss_claire_glimmersticks_for_lips_l_26_sharbat_pink_1_8_gm_229280_1_2.jpg",
          "priorityLevel": 1
        },
        {
          "imageUrl": "https://www.netmeds.com/images/product-v1/600x600/948475/miss_claire_glimmersticks_for_lips_l_26_sharbat_pink_1_8_gm_458044_2_0.jpg",
          "priorityLevel": 2
        },
        {
          "imageUrl": "https://www.netmeds.com/images/product-v1/600x600/948475/miss_claire_glimmersticks_for_lips_l_26_sharbat_pink_1_8_gm_458045_3_0.jpg",
          "priorityLevel": 3
        },
        {
          "imageUrl": "https://www.netmeds.com/images/product-v1/600x600/948475/miss_claire_glimmersticks_for_lips_l_26_sharbat_pink_1_8_gm_458046_4_0.jpg",
          "priorityLevel": 4
        }
      ],
      "algoliaFacet": {
        "general": {
          "Product Characteristic": [
            "Vegan"
          ],
          "Skin Type": [
            "All Skin Types"
          ]
        }
      },
      "productVariant": [
        {
          "seqNo": 22,
          "variantSetName": "6063",
          "facetName": "Color",
          "facetValue": "L-26 Sharbat Pink",
          "additionalInfo": {
            "swatch_image_url": []
          }
        },
        {
          "seqNo": 72,
          "variantSetName": "6063",
          "facetName": "Size",
          "facetValue": "1.8gm",
          "additionalInfo": ""
        }
      ],
      "additionVerticalInfo": {
        "fynd": {
          "channelId": "JIOMART"
        },
        "MDH": {
          "channelIdS": [
            "NETMEDS",
            "JIOMART"
          ]
        }
      }
    },
    "mdh_meta": {
      "source": "littleboy",
      "vertical": "BEAUTY",
      "channel_id": "JIOMART",
      "cms_attributes": {
        "sku_code": 948475,
        "identifier_type": "CREATED_BY_CMS",
        "category_tree_id": "1"
      },
      "others": {},
      "event": {
        "name": "littleboy-product",
        "type": "create",
        "version": "1"
      }
    }
  },
  "meta": {
    "event": {
      "name": "littleboy-product",
      "source": "littleboy",
      "version": "1",
      "type": "upsert",
      "vertical": "PHARMA",
      "channel_id": []
    },
    "organization_id": 1,
    "trace_id": [
      "mdh-data-ingestion-layer.0000000000000000ee657282289ac3b7"
    ],
    "created_timestamp": 1690884083936,
    "service": {
      "name": "mdh-data-ingestion-layer"
    }
  }
}