// const express = require('express');
// const router = express.Router();
// const UserPreference = require('../models/UserInteraction');
// const UserInteraction = require('../models/UserPreference');
// const House = require('../models/House');

// // Function to sort properties based on user interactions
// async function sortPropertiesByInteraction(userId, properties) {
//   // Get interactions for this user and properties
//   const interactions = await UserInteraction.find({ 
//     user_id: userId, 
//     property_id: { $in: properties.map(p => p._id) } 
//   });

//   // Sort properties based on time spent, favorited, and skipped
//   return properties.sort((a, b) => {
//     const interactionA = interactions.find(interaction => interaction.property_id.equals(a._id));
//     const interactionB = interactions.find(interaction => interaction.property_id.equals(b._id));

//     if (!interactionA && !interactionB) return 0;
//     if (!interactionA) return 1;
//     if (!interactionB) return -1;

//     // Prioritize favorited properties, then by time spent, and avoid skipped properties
//     const scoreA = (interactionA.favorited ? 1000 : 0) + interactionA.time_spent - (interactionA.skipped ? 100 : 0);
//     const scoreB = (interactionB.favorited ? 1000 : 0) + interactionB.time_spent - (interactionB.skipped ? 100 : 0);

//     return scoreB - scoreA;
//   });
// }

// router.get('/', async (req, res) => {
//   try {
//     const { search, area_type, minPrice, maxPrice, userId } = req.query;
//     let query = { isAvailable: true };  // Only show available houses

//     // Apply search and filter logic if provided
//     if (search) {
//       query.$or = [
//         { title: new RegExp(search, 'i') },
//         { location: new RegExp(search, 'i') }
//       ];
//     }
//     if (area_type) query.area_type = area_type;
//     if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
//     if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

//     // If user is not logged in, show all houses based on filters (if any)
//     if (!userId) {
//       const houses = await House.find(query).populate('seller', 'name');
//       return res.json(houses.length > 0 ? houses : { message: 'No items available. Please try again later.' });
//     }

//     // If user is logged in and there’s no search/filter, show recommended houses
//     let houses;
//     if (!search && !area_type && !minPrice && !maxPrice) {
//       const userPreference = await UserPreference.findOne({ user_id: userId });

//       if (userPreference) {
//         // Build recommendation query based on user preferences
//         query = {
//           ...query,
//           property_type: { $in: userPreference.property_type_preferences },
//           location: { $in: userPreference.preferred_locations },
//           price: { 
//             $gte: userPreference.budget_range.min, 
//             $lte: userPreference.budget_range.max 
//           }
//         };

//         const recommendedProperties = await House.find(query).populate('seller', 'name').limit(10);

//         // Sort recommended properties by user interactions
//         houses = await sortPropertiesByInteraction(userId, recommendedProperties);
//       } else {
//         // If no preferences, show all available houses
//         houses = await House.find(query).populate('seller', 'name');
//       }
//     } else {
//       // Apply search and filter for logged-in users
//       houses = await House.find(query).populate('seller', 'name');

//       // Store search/filter interactions in user preferences if applicable
//       if (userId && (search || area_type || minPrice || maxPrice)) {
//         let userPreference = await UserPreference.findOne({ user_id: userId });

//         // Extract locations that match the search term for possible preference update
//         const matchedLocations = houses
//           .map(house => house.location)
//           .filter(location => location.toLowerCase().includes(search.toLowerCase()));

//         if (matchedLocations.length > 0) {
//           const bestMatch = matchedLocations.sort((a, b) => a.length - b.length)[0];

//           if (userPreference) {
//             let isUpdated = false;

//             if (bestMatch && !userPreference.preferred_locations.includes(bestMatch)) {
//               userPreference.preferred_locations.push(bestMatch);
//               userPreference.preferred_locations = [...new Set(userPreference.preferred_locations)];
//               isUpdated = true;
//             }

//             if (area_type && !userPreference.property_type_preferences.includes(area_type)) {
//               userPreference.property_type_preferences.push(area_type);
//               isUpdated = true;
//             }

//             if (minPrice || maxPrice) {
//               const newMin = minPrice ? Number(minPrice) : userPreference.budget_range.min;
//               const newMax = maxPrice ? Number(maxPrice) : userPreference.budget_range.max;
//               if (newMin !== userPreference.budget_range.min || newMax !== userPreference.budget_range.max) {
//                 userPreference.budget_range.min = Math.min(userPreference.budget_range.min || newMin, newMin);
//                 userPreference.budget_range.max = Math.max(userPreference.budget_range.max || newMax, newMax);
//                 isUpdated = true;
//               }
//             }

//             if (isUpdated) {
//               userPreference.last_updated = new Date();
//               await userPreference.save();
//             }
//           } else {
//             userPreference = new UserPreference({
//               user_id: userId,
//               property_type_preferences: area_type ? [area_type] : [],
//               preferred_locations: bestMatch ? [bestMatch] : [],
//               budget_range: {
//                 min: minPrice ? Number(minPrice) : undefined,
//                 max: maxPrice ? Number(maxPrice) : undefined
//               }
//             });
//             await userPreference.save();
//           }
//         }
//       }
//     }

//     res.json(houses.length > 0 ? houses : { message: 'No items related to search available. Please try again later.' });
//   } catch (error) {
//     console.error("Error fetching houses or updating preferences:", error);
//     res.status(500).json({ error: 'Failed to fetch houses or update preferences' });
//   }
// });

// module.exports = router;

//----------------------------------------------------------------------------------------

const express = require('express');
const router = express.Router();
const UserPreference = require('../models/UserPreference');
const UserInteraction = require('../models/UserInteraction');
const House = require('../models/House');

// Function to recommend properties based on similar users
async function recommendProperties(userId) {
  try {
    // Step 1: Retrieve the current user's preferences
    const userPreferences = await UserPreference.findOne({ user_id: userId });

    // Step 2: Find similar users based on shared preferences
    const similarUsers = await UserPreference.find({
      user_id: { $ne: userId }, // Exclude the current user
      property_type_preferences: { $in: userPreferences.property_type_preferences },
      preferred_locations: { $in: userPreferences.preferred_locations },
    }).limit(5); // Limit for efficiency

    // Step 3: Collect property IDs from similar users' interactions
    const similarUserIds = similarUsers.map((user) => user.user_id);
    const similarUserInteractions = await UserInteraction.find({
      user_id: { $in: similarUserIds },
    });

    const recommendedPropertyIds = similarUserInteractions.map((interaction) => interaction.property_id);

    // Step 4: Filter out properties the target user has already interacted with
    const userInteractions = await UserInteraction.find({ user_id: userId });
    const userPropertyIds = userInteractions.map((interaction) => interaction.property_id);

    const finalRecommendations = recommendedPropertyIds.filter(
      (propertyId) => !userPropertyIds.includes(propertyId)
    );

    // Step 5: Fetch the recommended property details
    return await House.find({ _id: { $in: finalRecommendations } });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
}

// Function to sort properties based on user interactions for collaborative filtering
async function sortPropertiesByInteraction(userId, properties) {
  const propertyIds = properties.map((p) => p._id);
  const interactions = await UserInteraction.find({
    user_id: userId,
    property_id: { $in: propertyIds },
  });

  return properties.sort((a, b) => {
    const interactionA = interactions.find((interaction) => interaction.property_id.equals(a._id));
    const interactionB = interactions.find((interaction) => interaction.property_id.equals(b._id));

    if (!interactionA && !interactionB) return 0;
    if (!interactionA) return 1;
    if (!interactionB) return -1;

    const scoreA = (interactionA.favorited ? 1000 : 0) + interactionA.time_spent - (interactionA.skipped ? 100 : 0);
    const scoreB = (interactionB.favorited ? 1000 : 0) + interactionB.time_spent - (interactionB.skipped ? 100 : 0);

    return scoreB - scoreA;
  });
}

router.get('/', async (req, res) => {
  try {
    const { search, area_type, minPrice, maxPrice, userId } = req.query;
    let query = { isAvailable: true };

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') }
      ];
    }
    if (area_type) query.area_type = area_type;
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

    let houses;

    if (!userId) {
      houses = await House.find(query).populate('seller', 'name');
      return res.json(houses.length > 0 ? houses : { message: 'No items available. Please try again later.' });
    }

    if (!search && !area_type && !minPrice && !maxPrice) {
      const userPreference = await UserPreference.findOne({ user_id: userId });

      if (userPreference) {
        query = {
          ...query,
          property_type: { $in: userPreference.property_type_preferences },
          location: { $in: userPreference.preferred_locations },
          price: {
            $gte: userPreference.budget_range.min,
            $lte: userPreference.budget_range.max,
          },
        };

        let recommendedProperties = await House.find(query).populate('seller', 'name').limit(10);
        const collaborativeRecommendations = await recommendProperties(userId);
        recommendedProperties = [...new Set([...recommendedProperties, ...collaborativeRecommendations])];
        houses = await sortPropertiesByInteraction(userId, recommendedProperties);
      } else {
        houses = await House.find(query).populate('seller', 'name');
      }
    } else {
      houses = await House.find(query).populate('seller', 'name');

      if (userId && (search || area_type || minPrice || maxPrice)) {
        let userPreference = await UserPreference.findOne({ user_id: userId });
        const matchedLocations = houses
          .map((house) => house.location)
          .filter((location) => location.toLowerCase().includes(search.toLowerCase()));

        if (matchedLocations.length > 0) {
          const bestMatch = matchedLocations.sort((a, b) => a.length - b.length)[0];
          if (userPreference) {
            let isUpdated = false;

            if (bestMatch && !userPreference.preferred_locations.includes(bestMatch)) {
              userPreference.preferred_locations.push(bestMatch);
              userPreference.preferred_locations = [...new Set(userPreference.preferred_locations)];
              isUpdated = true;
            }

            if (area_type && !userPreference.property_type_preferences.includes(area_type)) {
              userPreference.property_type_preferences.push(area_type);
              isUpdated = true;
            }

            if (minPrice || maxPrice) {
              const newMin = minPrice ? Number(minPrice) : userPreference.budget_range.min;
              const newMax = maxPrice ? Number(maxPrice) : userPreference.budget_range.max;
              if (newMin !== userPreference.budget_range.min || newMax !== userPreference.budget_range.max) {
                userPreference.budget_range.min = Math.min(userPreference.budget_range.min || newMin, newMin);
                userPreference.budget_range.max = Math.max(userPreference.budget_range.max || newMax, newMax);
                isUpdated = true;
              }
            }

            if (isUpdated) {
              userPreference.last_updated = new Date();
              await userPreference.save();
            }
          } else {
            userPreference = new UserPreference({
              user_id: userId,
              property_type_preferences: area_type ? [area_type] : [],
              preferred_locations: bestMatch ? [bestMatch] : [],
              budget_range: {
                min: minPrice ? Number(minPrice) : undefined,
                max: maxPrice ? Number(maxPrice) : undefined,
              },
            });
            await userPreference.save();
          }
        }
      }
    }

    res.json(houses.length > 0 ? houses : { message: 'No items related to search available. Please try again later.' });
  } catch (error) {
    console.error("Error fetching houses or updating preferences:", error);
    res.status(500).json({ error: 'Failed to fetch houses or update preferences' });
  }
});

module.exports = router;


