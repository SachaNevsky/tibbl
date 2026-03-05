import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("tibbl-app", "welcome/welcome.tsx"),
    route("teacher", "teacher/teacher.tsx")
] satisfies RouteConfig;