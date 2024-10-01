import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ChipCases from "../components/chipCases"

const chipCaseData = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
]

const stats = [
  { label: "Games Played", value: 120 },
  { label: "Win Rate", value: "58%" },
  { label: "Total Winnings", value: "$1,500" },
  { label: "Highest Win", value: "$500" },
]

export default function Profile() {
  return (
    <main className="min-h-screen overflow-auto p-4 md:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <Card>
          <CardHeader className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" alt="Profile picture" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">John Doe</h1>
                <p className="text-muted-foreground">Poker Enthusiast</p>
              </div>
            </div>
            <button className="rounded-full bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Edit Profile
            </button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </CardContent>
        </Card>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Chip Cases</h2>
          <ChipCases chipCaseData={chipCaseData} />
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Statistics</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        <section>
          <h2 className="mb-4 text-2xl font-bold">Recent Activity</h2>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {[1, 2, 3].map((item) => (
                  <li key={item} className="p-4">
                    <p className="font-medium">Game #{item}</p>
                    <p className="text-sm text-muted-foreground">
                      Played on {new Date().toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}