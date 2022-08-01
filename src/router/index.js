import { createRouter,createWebHashHistory} from "vue-router";

const hall = () => import("../views/hall")
const owtSample = () => import("../views/owtSample")

const routes = [
  { path: "/", redirect: "/hall" },
  {
    path: "/hall",
    name: "hall",
    component: hall
  },
  {
    path: "/owtSample",
    name: "owtSample",
    component: owtSample
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router