import type { Restaurant } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star } from "lucide-react"

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <img src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} className="w-full h-48 object-cover" />
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{restaurant.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {restaurant.cuisine} • {restaurant.priceRange}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-semibold">{restaurant.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{restaurant.description}</p>
        <p className="text-xs text-muted-foreground mb-4">Hours: {restaurant.workingHours}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm">{restaurant.reviews} reviews</span>
          <Link href={`/restaurants/${restaurant.id}`}>
            <Button size="sm">Book Table</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
