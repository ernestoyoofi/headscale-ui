import { proxyLogin, proxyNewDefaultAdmin, proxyUpdatePassword, proxyUpdateTokenkey } from "./endpoints/proxy/users"
import { proxyGetMiddleware } from "./endpoints/proxy/middleware"
import { getUsers, deleteUser, renameUser, createUser } from "./endpoints/headscale/users"
import { getNode, getNodes, registerNode, approveNodeRoutes, expireNode, setNodeTags, deleteNode, renameNode } from "./endpoints/headscale/nodes"
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
    // Users
    getuser: getUsers,
    createuser: createUser,
    renameuser: renameUser,
    deleteuser: deleteUser,
    // Nodes
    nodes: getNodes,
    node: getNode,
    rename: renameNode,
    register: registerNode,
    approve_routes: approveNodeRoutes,
    tags: setNodeTags,
    expire: expireNode,
    remove: deleteNode,
    // Policy
    policy: getPolicy,
    setpolicy: setPolicy,
  }
}