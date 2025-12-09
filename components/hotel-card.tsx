import type { Hotel } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star } from "lucide-react"

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <img src={hotel.image || "/placeholder.svg"} alt={hotel.name} className="w-full h-48 object-cover" />
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{hotel.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{hotel.location}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-semibold">{hotel.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{hotel.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
              {amenity}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold">${hotel.pricePerNight}/night</div>
          <Link href={`/hotels/${hotel.id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
