import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "./LoadingError/Loading";
import Message from "./LoadingError/Error";
import moment from "moment";
import { downloadMonthlyReport } from "../Redux/Action/reportActions";

const Invoices = () => {
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList || {});
  const { loading: loadingOrders, error: errorOrders, orders = [] } = orderList;

  const report = useSelector((state) => state.report || {});
  const { loading: loadingReport, error: errorReport } = report;

  const [selectedMonth, setSelectedMonth] = useState("2025-07");

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const exportPDF = () => {
    dispatch(downloadMonthlyReport(selectedMonth));
  };

  // Protection ici : orders vaut toujours un tableau
  const filteredOrders = orders.filter((order) => {
    const orderDate = moment(order.createdAt);
    return orderDate.format("YYYY-MM") === selectedMonth;
  });

  const totalGeneral = filteredOrders.reduce(
    (acc, order) => acc + order.totalPrice,
    0
  );

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Rapport de Vente</h4>
        <div className="d-flex gap-2">
          <input
            type="month"
            className="form-control"
            value={selectedMonth}
            onChange={handleMonthChange}
          />
          <button
            onClick={exportPDF}
            className="btn btn-success"
            disabled={loadingReport}
          >
            {loadingReport ? "Génération..." : "Exporter en PDF"}
          </button>
        </div>
      </div>

      {errorReport && <Message variant="alert-danger">{errorReport}</Message>}

      <div className="card shadow p-4">
        {/* --- LOGO + EN-TÊTE --- */}
        <div className="d-flex align-items-center mb-4">
          <img
            src="images/favicon1.png"
            alt="Logo entreprise"
            style={{ width: "80px", marginRight: "15px" }}
          />
          <div>
            <h5 className="mb-1">Mudilux Boutique</h5>
            <p className="mb-0">Rapport mensuel de ventes</p>
            <small>Période : {selectedMonth}</small>
          </div>
        </div>

        {/* --- TABLEAU DES VENTES --- */}
        {loadingOrders ? (
          <Loading />
        ) : errorOrders ? (
          <Message variant={"alert-danger"}> {errorOrders} </Message>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-primary text-center">
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Produit & Quantité</th>
                  <th>Prix</th>
                  <th>Total($)</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr className="text-center" key={order._id}>
                    <td>
                      {order.isPaid ? (
                        <span className="badge rounded-pill alert-success">
                          {moment(order.createdAt).format(
                            "DD-MM-YYYY hh:mm:ss"
                          )}
                        </span>
                      ) : (
                        <span className="badge rounded-pill alert-danger">
                          Non payé
                        </span>
                      )}
                    </td>
                    <td>
                      <b>{order.shippingAdress.adress}</b>
                    </td>
                    <td>
                      {order.orderItems?.map((item, index) => (
                        <div key={index}>
                          {item.name} - ({item.qty}pcs)
                        </div>
                      ))}
                    </td>
                    <td>
                      {order.orderItems?.map((item, index) => (
                        <div key={index}>${item.price}</div>
                      ))}
                    </td>
                    <td>${order.totalPrice}</td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="table-light">
                <tr className="fw-bold text-center">
                  <td colSpan="4">Total des Ventes</td>
                  <td>{totalGeneral.toLocaleString()} $</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
