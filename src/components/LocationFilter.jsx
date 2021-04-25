import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import FilterButton from "./FilterButton"

export default function LocationFilter({ data, city, resource }) {
  const router = useRouter()
  const filter = router.pathname === "/" && "all"
  const [showMore, setShowMore] = React.useState(false)

  const renderButtons = () => {
    let _data = data.sort()

    if (!showMore) {
      _data = [
        "Delhi",
        "Bangalore",
        "Chennai",
        "Mumbai",
        "Kolkata",
        "Lucknow",
        "Noida",
        "Gurgaon",
      ]
      if (filter !== "all" && !_data.includes(filter)) {
        _data = [..._data, filter]
      }
    }

    return _data
      .filter((i) => typeof i !== "boolean")
      .map((item) => {
        return (
          <Link
            key={item}
            href={
              resource === null
                ? "/" + item.toString().toLowerCase()
                : `/${item.toString().toLowerCase()}/${resource}`
            }
            passHref
          >
            <FilterButton
              active={
                typeof city === "string" &&
                city.toLowerCase() === item.toLowerCase()
              }
            >
              {item}
            </FilterButton>
          </Link>
        )
      })
  }

  return (
    <div className="shadow-md bg-white box-border h-auto w-full rounded-md p-3 lg:p-6 border border-gray-200">
      <div className="flex ml-1">
        <svg
          className="mt-1"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.75 7.5C15.75 12.75 9 17.25 9 17.25C9 17.25 2.25 12.75 2.25 7.5C2.25 5.70979 2.96116 3.9929 4.22703 2.72703C5.4929 1.46116 7.20979 0.75 9 0.75C10.7902 0.75 12.5071 1.46116 13.773 2.72703C15.0388 3.9929 15.75 5.70979 15.75 7.5Z"
            fill="#4F46EF"
          />
          <path
            d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z"
            fill="#4F46EF"
            stroke="white"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p className="text-strong ml-1 mt-0.5 font-bold">
          Choose Your Location
        </p>
      </div>
      <div className="mt-2 text-start text-left flex-wrap flex items-center justify-start">
        <Link href="/">
          <FilterButton active={typeof city !== "string"}>All</FilterButton>
        </Link>
        {renderButtons()}
      </div>
      <div className="mt-2 ml-1">
        <button
          className="hover:text-underline flex text-indigo-600"
          onClick={() => setShowMore((prev) => !prev)}
        >
          <span>
            {showMore ? "Show only top locations" : "Show all locations"}
          </span>
          <svg
            className="mt-1"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="#4F46EF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
