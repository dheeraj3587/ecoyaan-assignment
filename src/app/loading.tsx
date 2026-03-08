import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="mx-auto mb-8 flex max-w-md items-center justify-between">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                        </div>
                        {i < 3 && <div className="mx-3 h-0.5 w-12 rounded-full bg-muted sm:w-20" />}
                    </div>
                ))}
            </div>
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                <div className="space-y-4">
                    <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                    {[1, 2].map((i) => (
                        <Card key={i}>
                            <CardContent className="flex gap-4 p-4">
                                <div className="h-24 w-24 animate-pulse rounded-lg bg-muted sm:h-28 sm:w-28" />
                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                                        <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-muted" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
                                        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div>
                    <Card>
                        <CardContent className="space-y-3 pt-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                                    <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                                </div>
                            ))}
                            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
