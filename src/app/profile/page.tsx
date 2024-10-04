"use client"
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ChipCases from "../components/shared/chipCases"
import { useDataContext } from '../Context';

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
  const { data, loading, error } = useDataContext();

  useEffect(() => {
    console.log('Context Data in Profile:', data);
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <main className="min-h-screen overflow-auto p-4 md:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        {data && data.user && (
          <section>
            <h2 className="mb-4 text-2xl font-bold">Welcome, {data.user.firstName}</h2>
          </section>
        )}
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