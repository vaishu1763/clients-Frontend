import React, { useEffect, useState } from "react";

function ClientsDynamicTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disableInsert, setDisableInsert] = useState(true); // 🔹 Insert button initially disabled

  // =====================
  // Fetch clients
  // =====================
  const fetchClients = async () => {
    const res = await fetch("http://localhost:3000/clients");
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // =====================
  // Insert test client (Optional)
  // =====================
  const insertClient = async () => {
    if (disableInsert) return; // Button disabled → prevent insert

    await fetch("http://localhost:3000/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        party: {
          PTY_ID: "party11",
          PTY_FirstName: "New",
          PTY_LastName: "Client",
          PTY_Phone: "9999999999",
        },
        address: {
          Add_ID: "addr11",
          Add_PartyID: "party11",
          Add_Line1: "Street 11",
          Add_City: "Gurgaon",
          Add_State: "HR",
          Add_Zip: "122001",
        },
      }),
    });

    fetchClients(); // instant refresh
  };

  if (loading) return <p>Loading...</p>;

  const rows = data.flatMap((item) =>
    item.addresses.map((addr) => ({
      name: `${item.client.PTY_FirstName || ""} ${
        item.client.PTY_LastName || ""
      }`,
      phone: item.client.PTY_Phone,
      address: addr.address.Add_Line1,
      city: addr.address.Add_City,
      zip: addr.address.Add_Zip,
      state: addr.state
        ? `${addr.state.State_Name} (${addr.state.State_ID})`
        : addr.address.Add_State,
    }))
  );

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f7f9fc",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "#333", marginBottom: 15 }}>
        Customers ({rows.length})
      </h2>

      {/* 🔹 Insert Client button */}
      <button
        onClick={insertClient}
        disabled={disableInsert} // 🔹 Disable to prevent accidental inserts
        style={{
          backgroundColor: disableInsert ? "#a0a0a0" : "#4CAF50",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: 5,
          cursor: disableInsert ? "not-allowed" : "pointer",
          transition: "background-color 0.3s",
          marginBottom: 20,
        }}
        onMouseEnter={(e) =>
          !disableInsert && (e.target.style.backgroundColor = "#45a049")
        }
        onMouseLeave={(e) =>
          !disableInsert && (e.target.style.backgroundColor = "#4CAF50")
        }
      >
        Insert Client (Disabled for Safety)
      </button>

      <table
        border="0"
        cellPadding="10"
        style={{
          marginTop: 20,
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              style={{
                backgroundColor: i % 2 === 0 ? "#ffffff" : "#f2f2f2",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#d9f2d9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  i % 2 === 0 ? "#ffffff" : "#f2f2f2")
              }
            >
              <td>{r.name}</td>
              <td>{r.phone}</td>
              <td>{r.address}</td>
              <td>{r.city}</td>
              <td>{r.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientsDynamicTable;
