const Info = () => {
  return (
    <div className="info-container ">
      <div className={`col-box correct tooltip`}>
        <span class="tooltiptext">Correct</span>
      </div>
      <div className={`col-box present tooltip`}>
        <span class="tooltiptext">Present</span>
      </div>
      <div className={`col-box absent tooltip`}>
        <span class="tooltiptext">Absent</span>
      </div>
    </div>
  );
};
export default Info;
