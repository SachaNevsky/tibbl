import type { Route } from "./+types/home";
import Welcome from "~/welcome/welcome";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "TIBBL" },
    { name: "description", content: "TIBBL web application" },
  ];
}

export default function Home() {
  return <Welcome />;
}
