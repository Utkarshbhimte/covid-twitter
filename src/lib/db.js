const fs = require("fs")
const path = require("path")
const { connectToDatabase } = require("./mongo")
const TweetModel = require("../schemas/tweet")
const { scrape } = require("./scrape")

/**
 * @param {string} city
 */
module.exports.addCity = async (city) => {
  await connectToDatabase()
}

/**
 * @param {string} tweetId
 */
module.exports.statusUpvote = async (tweetId) => {
  await connectToDatabase()
  return await TweetModel.findOneAndUpdate(
    {
      id: tweetId,
    },
    {
      $inc: {
        status: 1,
      },
    }
  )
}

/**
 * @param {string} tweetId
 */
module.exports.statusDownvote = async (tweetId) => {
  await connectToDatabase()
  return await TweetModel.findOneAndUpdate(
    {
      id: tweetId,
    },
    {
      $inc: {
        status: -1,
      },
    }
  )
}

const getTweets = async (city, resource) => {
  await connectToDatabase()
  const query = {}
  if (typeof city === "string" && typeof resource === "string") {
    let key1 = "location." + city
    query[key1] = true
    let key2 = "resource." + resource
    query[key2] = true
  } else if (typeof city === "string") {
    let key = "location." + city
    query[key] = true
  } else if (typeof resource === "string") {
    let key = "resource." + resource
    query[key] = true
  }

  const result = await TweetModel.find(query).exec()
  return result.map((item) => {
    const { _id, __v, createdAt, updatedAt, ...doc } = item._doc
    return doc
  })
}

const getAllTweets = async (toScrape = true) => {
  const conn = await connectToDatabase()
  if (toScrape) await scrape()
  const tweets = await TweetModel.find({})
  await conn.disconnect()
  return tweets.map((item) => {
    const { _id, __v, createdAt, updatedAt, ...doc } = item._doc
    return doc
  })
}

module.exports.getCityResources = async () => {
  //return (await store.doc("main/city_resources").get()).data()
  return {}
}

const fetchFirstTime = async () => {
  const tweetsPath = path.resolve(process.cwd(), "tweets.json")
  const lockPath = path.resolve(process.cwd(), "tweets-lock.json")
  const lockFileData = JSON.stringify({ time: new Date().toISOString() })
  fs.writeFileSync(lockPath, lockFileData, { encoding: "utf-8" })
  const tweets = await getAllTweets()
  fs.writeFileSync(tweetsPath, JSON.stringify(tweets, null, 4), {
    encoding: "utf-8",
  })
  return tweets
}

module.exports.fetchFirstTime = fetchFirstTime
module.exports.getAllTweets = getAllTweets
module.exports.getTweets = getTweets
