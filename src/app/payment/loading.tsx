import { Card, CardContent } from "@/components/ui/card";

export default function PaymentLoading() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                <div className="space-y-6">
                    <div className="h-8 w-32 animate-pulse rounded bg-muted" />
                    <Card>
                        <CardContent className="space-y-3 pt-6">
                            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="space-y-3 pt-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className="space-y-3 pt-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
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
