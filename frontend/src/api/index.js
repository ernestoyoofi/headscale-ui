import { proxyLogin, proxyNewDefaultAdmin, proxyUpdatePassword, proxyUpdateTokenkey } from "./endpoints/proxy/users"
import { proxyGetMiddleware } from "./endpoints/proxy/middleware"
import { getUsers, deleteUser, renameUser, createUser } from "./endpoints/headscale/users"
import { getNode, getNodes, registerNode, approveNodeRoutes, expireNode, setNodeTags, deleteNode } from "./endpoints/headscale/nodes"
import { getPolicy, setPolicy } from "./endpoints/headscale/policy"

export default {
  proxy: {
    login: proxyLogin,
    default_admin: proxyNewDefaultAdmin,
    update_password: proxyUpdatePassword,
    update_apikey: proxyUpdateTokenkey,
    middleware: proxyGetMiddleware,
  },
  api: {
    getuser: getUsers,
    createuser: createUser,
    renameuser: renameUser,
    deleteuser: deleteUser,
    nodes: getNodes,
    node: getNode,
    node_register: registerNode,
    approve_routes: approveNodeRoutes,
    node_expire: expireNode,
    settag: setNodeTags,
    delnode: deleteNode,
    policy: getPolicy,
    setpolicy: setPolicy,
  }
}