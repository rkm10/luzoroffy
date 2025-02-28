import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

const seasons = [
  {
    name: "Winter",
    description: "Start of the year anime releases, typically airing in January-March",
    image: "❄️"
  },
  {
    name: "Spring",
    description: "Spring season releases, typically airing in April-June",
    image: "🌸"
  },
  {
    name: "Summer",
    description: "Summer season releases, typically airing in July-September",
    image: "☀️"
  },
  {
    name: "Fall",
    description: "Fall season releases, typically airing in October-December",
    image: "🍁"
  }
];

function Page({ params }) {
  const year = params.year;

  // Add validation for year
  if (isNaN(year) || year < 1917 || year > new Date().getFullYear()) {
    return (
      <div className="container mx-auto pt-14 p-4 md:p-8 md:pt-14">
        <h1 className="text-2xl font-bold mb-4">Invalid Year</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-14 p-4 md:p-8 md:pt-14">
      <h1 className="text-2xl font-bold mb-4">Anime from {year}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {seasons.map((season) => (
          <Link
            key={season.name.toLowerCase()}
            href={`/anime/${year}/${season.name.toLowerCase()}`}
          >
            <Card className="hover:bg-accent transition-colors">
              <CardHeader>
                <div className="text-4xl mb-2">{season.image}</div>
                <CardTitle>{season.name}</CardTitle>
                <CardDescription>{season.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Page
