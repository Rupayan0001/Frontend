const getDisplayName = (windowWidth, activeEntity) => {
  const name = activeEntity?.name || "";

  if (windowWidth >= 900) {
    return <p className="text-white text-[17px] font-bold">{name.length > 28 ? name.slice(0, 28) + "..." : name}</p>;
  } else if (windowWidth < 900 && windowWidth >= 700) {
    return <p className="text-white text-[17px] font-bold">{name.length > 32 ? name.slice(0, 32) + "..." : name}</p>;
  } else if (windowWidth < 700 && windowWidth >= 500) {
    return <p className="text-white text-[17px] font-bold">{name.length > 28 ? name.slice(0, 28) + "..." : name}</p>;
  } else if (windowWidth < 500 && windowWidth >= 400) {
    return <p className="text-white text-[17px] font-bold">{name.length > 22 ? name.slice(0, 22) + "..." : name}</p>;
  } else if (windowWidth < 400 && windowWidth >= 350) {
    return <p className="text-white text-[16px] font-bold">{name.length > 20 ? name.slice(0, 20) + "..." : name}</p>;
  } else if (windowWidth < 350) {
    return <p className="text-white text-[16px] font-bold">{name.length > 18 ? name.slice(0, 18) + "..." : name}</p>;
  }
};
export default getDisplayName;
