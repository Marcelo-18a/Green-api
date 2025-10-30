const roleCheck = (roles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({ message: "Access denied: Role not found" })
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: "Access denied: Insufficient permissions" })
    }

    next()
  }
}

export default roleCheck
