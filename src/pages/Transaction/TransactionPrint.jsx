import React from "react";

const TransactionPrint = ({ transaction }) => {
  return (
    <tr>
      <td>{transaction.paymentDate.split("T")[0]}</td>
      <td>#{transaction.orderId.slice(19)}</td>
      <td> {transaction?.branch?.name}</td>

      <td>{transaction.userName}</td>
      <td>{transaction.userEmail}</td>
      <td>{transaction.userPhone}</td>
      <td> Tk {transaction.receivedTk}</td>
      <td>
        {" "}
        {transaction?.paymentType === "bkash" ||
        transaction?.paymentType === "nagad" ? (
          <span>
            {" "}
            {transaction?.paymentType}, {transaction?.paymentNumber}, Trx :{" "}
            {transaction?.transactionId}
          </span>
        ) : (
          transaction?.paymentType
        )}
        {transaction?.paymentType === "bank" ? (
          <span>
            {" "}
            {transaction?.paymentType}, {transaction?.bankName},
            {transaction?.bankHoldingName}
          </span>
        ) : (
          ""
        )}
      </td>
    </tr>
  );
};

export default TransactionPrint;
