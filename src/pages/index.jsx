import * as React from "react"
import { useRouter } from "next/router"
import { Dashboard } from "~/components/Dashboard"
import Navbar from "~/components/Navbar"

const IndexPage = ({ tweets, resources, cities }) => {
  const router = useRouter()

  React.useEffect(() => {
    router.push("/delhi")
  }, [])

  return (
    <div className="w-screen">
      <Navbar />
      <Dashboard
        data={{
          tweets,
          resources,
          cities,
          city: null,
          resource: null,
        }}
      />
    </div>
  )
}

/**
 * @type {import("next").GetStaticProps<{}, {}>}
 */
export const getStaticProps = async () => {
  const cities = Object.keys(require("seeds/cities.json"))
  const resources = Object.keys(require("seeds/resources.json"))
  const { getAllTweets, fetchFirstTime } = require("../lib/db")
  const fs = require("fs")
  const path = require("path")
  const tweetsPath = path.resolve(process.cwd(), "tweets.json")
  const lockPath = path.resolve(process.cwd(), "tweets-lock.json")
  /** @type {Object[]} */
  let tweets

  if (fs.existsSync(lockPath)) {
    console.log("Lockfile exists")
    const { time } = JSON.parse(
      fs.readFileSync(lockPath, { encoding: "utf-8" })
    )
    if (fs.existsSync(tweetsPath)) {
      const fetchTime = new Date(time)
      const currentTime = new Date()
      const diff = currentTime - fetchTime
      console.log("Tweets file exists")
      if (diff / 1e3 >= 300) {
        console.log("Tweets are older than 5 minutes")
        fs.unlinkSync(tweetsPath)
        tweets = await getAllTweets()
        const lockFileData = JSON.stringify({ time: new Date().toISOString() })
        fs.writeFileSync(lockPath, lockFileData, { encoding: "utf-8" })
        fs.writeFileSync(tweetsPath, JSON.stringify(tweets, null, 4), {
          encoding: "utf-8",
        })
      } else {
        console.log("Reading tweets from fs")
        tweets = JSON.parse(fs.readFileSync(tweetsPath, { encoding: "utf-8" }))
      }
    } else {
      tweets = await fetchFirstTime()
    }
  } else {
    tweets = await fetchFirstTime()
  }

  return {
    props: {
      tweets,
      resources,
      cities,
    },
    revalidate: 300,
  }
}

export default IndexPage
