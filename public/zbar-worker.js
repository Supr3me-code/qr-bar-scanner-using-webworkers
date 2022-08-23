onmessage = (e) => {
  message = async () => {
    console.log("zBar worker called");
    const res = await scanImageData(e.data);
    postMessage({ rawValue: res[0].decode() });
  };
};
