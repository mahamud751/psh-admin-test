import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  BlobProvider,
} from "@react-pdf/renderer";

import pshLogo from "../../img/home/logo.png";
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
  },

  logo: {
    width: 60,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#35B0A7",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#35B0A7",
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    color: "#000000",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  section: {
    padding: 10,
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bold: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#35b0a7",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "5px",
    fontSize: 12,
  },
  mt3: {
    marginTop: 100,
  },
  bgGreen: {
    backgroundColor: "#35B0A7",
  },
  bgTransparentGreen: {
    backgroundColor: "rgba(53, 176, 167, 0.10)",
    marginBottom: 10,
  },
});

const DownlaodInvoice = ({ data }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <View>
            <Image src={pshLogo} style={styles.logo} />
          </View>

          <View>
            {/* Invoice title */}
            <Text style={styles.title}>INVOICE</Text>

            {/* Invoice number */}
            <Text style={styles.text}>#{data?.phone?.slice(1)}</Text>

            {/* Date */}
            <Text style={styles.text}>Date: {currentDate}</Text>

            {/* Payment Method */}
            <Text style={styles.text}>Payment Method: {data?.paymentType}</Text>
          </View>
        </View>

        {/* Booking Location */}
        <View
          style={{
            marginTop: "20px",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={styles.subtitle}>Booking Location</Text>
            <Text style={styles.text}>Branch: {data?.branch?.name}</Text>
            <Text
              style={{
                fontSize: 12,
                color: "#000000",
                marginBottom: 5,
                width: "150px",
              }}
            >
              Address: {data?.branch?.branchAddress}
            </Text>
            <Text style={styles.text}>
              Mobile: {data?.branch?.branchMobileNumber}
            </Text>
            <Text style={styles.text}>Email: {data?.branch?.branchEmail}</Text>
          </View>
          <View>
            {/* Bill To */}
            <View>
              <Text style={styles.subtitle}>Bill To</Text>
              <Text style={styles.text}>Name: {data?.fullName}</Text>
              <Text style={styles.text}>Address: {data?.address}</Text>
              <Text style={styles.text}>Mobile: {data?.phone}</Text>
              <Text style={styles.text}>Email: {data?.email}</Text>
              <Text style={styles.text}>
                Check in Time: {data?.bookingInfo?.rentDate?.bookStartDate}
              </Text>
              <Text style={styles.text}>
                Check Out Time: {data?.bookingInfo?.rentDate?.bookEndDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Table */}
        <View
          style={{
            backgroundColor: "#35B0A7",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 0px",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              color: "white",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                padding: "0 5px",
                fontSize: 12,
              }}
            >
              No
            </Text>

            <Text
              style={{
                marginLeft: 10,
                fontWeight: "bold",
                padding: "0 5px",
                fontSize: 12,
              }}
            >
              Service Name
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              color: "white",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                padding: "0 5px",
                fontSize: 12,
              }}
            >
              Total Duration
            </Text>
            <Text
              style={{
                marginLeft: 10,
                fontWeight: "bold",
                padding: "0 5px",
                fontSize: 12,
              }}
            >
              Amount
            </Text>
          </View>
        </View>

        {/* Booking Table Content */}
        <View
          style={{
            backgroundColor: "rgba(53, 176, 167, 0.10)",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",

            padding: 10,
          }}
        >
          <View
            style={{
              fontWeight: "bold",
              fontSize: 12,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>01.</Text>
            <Text
              style={{
                fontWeight: "bold",

                fontSize: 12,
              }}
            >
              {data?.bookingInfo?.roomType === "Shared Room"
                ? `${data?.bookingInfo?.roomName}, Room Number : ${data?.bookingInfo?.roomNumber}, Seat Number : ${data?.bookingInfo?.seatBooking?.seatNumber}`
                : `${data?.bookingInfo?.data?.name}, Room Number : ${data?.bookingInfo?.data?.roomNumber}`}
            </Text>
          </View>
          <View
            style={{
              fontWeight: "bold",
              fontSize: 12,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>
              {data?.bookingInfo?.customerRent?.daysDifference >= 0
                ? `${data?.bookingInfo?.customerRent?.daysDifference} days`
                : data?.bookingInfo?.customerRent?.months &&
                  data?.bookingInfo?.customerRent?.days >= 0 &&
                  !data?.bookingInfo?.customerRent?.years
                ? `${data?.bookingInfo?.customerRent?.months} months, ${data?.bookingInfo?.customerRent?.days} days`
                : data?.bookingInfo?.customerRent?.years &&
                  data?.bookingInfo?.customerRent?.months >= 0 &&
                  data?.bookingInfo?.customerRent?.days >= 0
                ? `${data?.bookingInfo?.customerRent?.years} year`
                : ""}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 12,
                marginLeft: 10,
              }}
            >
              BDT {data?.bookingInfo?.subTotal?.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Other Booking Tables */}
        {Array.from({ length: 5 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.section,
              index % 2 === 0 ? styles.bgTransparentGreen : {},
            ]}
          />
        ))}

        {/* Payment Details */}
        <View style={[styles.flex]}>
          <View>
            <Text style={styles.bold}>Payment Received By</Text>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  marginTop: "5px",
                }}
              >
                Payment Method : {data?.paymentType}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginTop: "5px",
                }}
              >
                Account Number : {data?.paymentNumber}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginTop: "5px",
                }}
              >
                Transaction ID :{data?.transactionId}
              </Text>
            </View>
          </View>
          <View style={[styles.flex, styles.totalAmountRight]}>
            <View>
              <View style={styles.flex}>
                <Text style={styles.bold}>Subtotal :</Text>
                {/* <Text
              style={{
                marginLeft: "55px",
              }}
            >
              :
            </Text> */}
                <Text
                  style={{
                    fontSize: 12,
                  }}
                >
                  BDT {data?.bookingInfo?.subTotal?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.bold}>VAT :</Text>
                {/* <Text
              style={{
                marginLeft: "53px",
              }}
            >
              :
            </Text> */}
                <Text
                  style={{
                    fontSize: 12,
                  }}
                >
                  BDT {data?.bookingInfo?.vatTax?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.bold}>Addmission Fee :</Text>
                {/* <Text
              style={{
                marginLeft: " -9px",
              }}
            >
              :
            </Text> */}
                <Text
                  style={{
                    fontSize: 12,
                  }}
                >
                  BDT{" "}
                  {data?.bookingInfo?.addMissionFee > 0
                    ? data?.bookingInfo?.addMissionFee?.toLocaleString()
                    : 0}
                </Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.bold}>Security Fee :</Text>
                {/* <Text
              style={{
                marginLeft: " 9px",
              }}
            >
              :
            </Text> */}
                <Text
                  style={{
                    fontSize: 12,
                  }}
                >
                  BDT{" "}
                  {data?.bookingInfo?.securityFee > 0
                    ? data?.bookingInfo?.securityFee?.toLocaleString()
                    : 0}
                </Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.bold}>Total :</Text>
                {/* <Text
              style={{
                marginLeft: "78px",
              }}
            >
              :
            </Text> */}
                <Text
                  style={{
                    fontSize: 12,
                  }}
                >
                  BDT {data?.totalAmount?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.bold}>Discount :</Text>
                {/* <Text
              style={{
                marginLeft: "50px",
              }}
            >
              :
            </Text> */}
                <Text
                  style={{
                    fontSize: 12,
                  }}
                >
                  BDT {data?.bookingInfo?.discount?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.bold}>Paid :</Text>
                {/* <Text
              style={{
                marginLeft: "70px",
              }}
            >
              :
            </Text> */}
                <Text
                  style={{
                    fontSize: 12,
                  }}
                >
                  BDT {data?.totalReceiveTk?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.flex}>
                <Text
                  style={[
                    styles.bold,
                    { color: data?.dueAmount > 0 ? "red" : "" },
                  ]}
                >
                  Due :
                </Text>
                {/* <Text
              style={{
                marginLeft: "70px",
              }}
            >
              :
            </Text> */}
                <Text
                  style={{
                    fontSize: 12,
                  }}
                >
                  BDT {data?.dueAmount?.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Note */}
        <View
          style={{
            marginTop: 80,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",

            fontSize: 12,
          }}
        >
          <View style={styles.noteArea}>
            <Text style={[styles.bold, { color: "#35b0a7", fontSize: 10 }]}>
              Note:
            </Text>
            <View
              style={{
                width: 300,
                height: 50,
                backgroundColor: "#f7f7f7",
              }}
            ></View>
          </View>
          <View>
            <Text>Authorized Signature</Text>
            <View style={{ width: 200, borderBottomWidth: 1, marginTop: 6 }} />
          </View>
        </View>

        {/* Terms and Conditions */}
        <View>
          <Text
            style={{
              fontSize: 10,
              marginTop: 5,
            }}
          >
            Terms:
          </Text>
          <Text
            style={{
              fontSize: 10,
            }}
          >
            Please Read All Terms and Conditions
          </Text>
        </View>

        {/* Invoice Footer */}
        <View
          style={{
            backgroundColor: "#35b0a7",
            color: "white",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "3px 3px",
            marginTop: 30,

            fontSize: 12,
          }}
        >
          <Text>Head Office: House-23, Road-03, Dhanmondi, Dhaka</Text>
          <Text>Mobile: +8801647647404</Text>
          <Text>www.psh.com.bd</Text>
        </View>

        {/* Terms and Condition */}
        <View>
          <Text style={styles.subtitle}>Terms and Condition :</Text>
          <Text style={styles.text}>
            1. Booking and Reservation: All bookings are subject to
            availability.
          </Text>
          <Text style={styles.text}>
            2. Cancellation Policy: Cancellations made [X days/hours] prior to
            the check-in date will receive a full refund.
          </Text>
          <Text style={styles.text}>
            3. Check-In and Check-Out: Check-in time is at 3:00 PM, and
            check-out time is at 11:00 AM.
          </Text>
          <Text style={styles.text}>
            4. Room Occupancy: Each room is designed to accommodate a specific
            number of guests.
          </Text>
          <Text style={styles.text}>
            5. Payment and Fees: Payment can be made through [accepted payment
            methods].
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default DownlaodInvoice;
