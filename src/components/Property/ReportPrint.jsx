import React from "react";

const ReportPrint = ({ room }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  return (
    <tr>
      <td>
        {room?.roomNumber}
        {room?.rentDate?.map((rent) => (
          <div className="d-flex">
            {
              <p
                className="px-3 fw-bold"
                style={{
                  border:
                    rent?.bookEndDate >= currentDate ? "1px solid black" : "",
                  color: "red",
                }}
              >
                {rent?.bookEndDate >= currentDate ? (
                  <>
                    {rent?.bookStartDate} to {rent?.bookEndDate}
                  </>
                ) : (
                  ""
                )}
              </p>
            }
          </div>
        ))}
      </td>
      <td>
        {room?.seats?.map((seat) => (
          <div>
            <p> {seat?.seatNumber}</p>
            {seat?.rentDate?.map((rent) => (
              <div className="d-flex">
                <p
                  className="px-3 fw-bold  "
                  style={{
                    border:
                      rent?.bookEndDate >= currentDate ? "1px solid black" : "",
                    color: "red",
                  }}
                >
                  {" "}
                  {rent?.bookStartDate} to {rent?.bookEndDate}
                </p>
              </div>
            ))}
          </div>
        ))}
      </td>
      <td>
        {room?.category === "Shared Room" ? (
          <>
            {room?.seats?.map((seat) => {
              return seat?.rentDate?.map((rent) => {
                return (
                  <p>
                    {rent?.bookStartDate} to {rent?.bookEndDate}
                  </p>
                );
              });
            })}
          </>
        ) : (
          ""
        )}
      </td>
    </tr>
  );
};

export default ReportPrint;
