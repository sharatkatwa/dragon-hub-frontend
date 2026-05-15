const getId = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return value._id || value.id || "";
};

export const isLikedByUser = (item, user) => {
  if (typeof item?.liked === "boolean") {
    return item.liked;
  }

  const userId = getId(user);

  if (!userId || !Array.isArray(item?.likes)) {
    return false;
  }

  return item.likes.some((like) => getId(like) === userId);
};
