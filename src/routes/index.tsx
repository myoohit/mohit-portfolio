import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SystemLoader from "@/components/loading-screen/SystemLoader";
import { EntryScreen } from "@/components/entry-screen/EntryScreen";
import { MainScreen } from "@/components/main-screen/MainScreen";

type BootStage = "loading" | "entry" | "main";

const title = "Mohit Ramesh — AI Engineer";
const description =
  "AI engineering, software and backend development, and creative building. Bringing imagined things to life through code.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/**
 * Boot sequence: SystemLoader (fake system boot) -> EntryScreen (name
 * reveal / click-to-enter gate) -> MainScreen (the actual site).
 *
 * Only the active stage is mounted at a time — this keeps MainScreen's
 * IntersectionObserver and scroll listeners from doing any work until the
 * visitor has actually entered the site, and avoids a double scrollbar
 * while SystemLoader/EntryScreen are covering the viewport.
 */
function Index() {
  const [stage, setStage] = useState<BootStage>("loading");

  if (stage === "loading") {
    return <SystemLoader onComplete={() => setStage("entry")} />;
  }

  if (stage === "entry") {
    return <EntryScreen onEntered={() => setStage("main")} />;
  }

  return <MainScreen />;
}
