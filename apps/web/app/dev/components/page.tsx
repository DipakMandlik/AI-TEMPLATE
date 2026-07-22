import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ThemeToggle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ai-template/ui";
import { notFound } from "next/navigation";

export const metadata = { title: "Component preview" };

/** Internal-only preview of every packages/ui primitive in isolation. Not linked from the site nav. */
export default function ComponentPreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16">
      <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">Component preview</h1>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="solid">Solid</Badge>
        </div>
      </Section>

      <Section title="Card">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>A short supporting description.</CardDescription>
          </CardHeader>
          <CardContent>Card body content goes here.</CardContent>
        </Card>
      </Section>

      <Section title="Tooltip">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>A helpful tooltip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="one" className="max-w-sm">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">Tab one content.</TabsContent>
          <TabsContent value="two">Tab two content.</TabsContent>
        </Tabs>
      </Section>

      <Section title="Dialog">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog title</DialogTitle>
              <DialogDescription>Dialog description text.</DialogDescription>
            </DialogHeader>
            <p className="text-sm text-[var(--color-muted)]">Dialog body content.</p>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Sheet">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Open sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet title</SheetTitle>
            </SheetHeader>
            <p className="text-sm text-[var(--color-muted)]">Sheet body content.</p>
          </SheetContent>
        </Sheet>
      </Section>

      <Section title="Skeleton">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </Section>

      <Section title="Theme toggle">
        <ThemeToggle />
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-medium text-[var(--color-foreground)]">{title}</h2>
      {children}
    </section>
  );
}
