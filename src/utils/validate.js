const validateEditField = (req) => {
  const AllowedFieldUpdate = [
    "firstName",
    "lastName",
    "email",
    "bio",
    "profilePicture",
    "gender",
    "skills",
  ];

  const isUpdateAllowed = Object.keys(req.body).every((field) =>
    AllowedFieldUpdate.includes(field)
  );

  return isUpdateAllowed;
};

module.exports = {
  validateEditField,
};
