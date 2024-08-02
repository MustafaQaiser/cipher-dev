import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import itemsApiResponse from "../itemApiResponse"; 


const validationSchema = Yup.object().shape({
  name: Yup.string().required("Tax name is required"),
  rate: Yup.number().required("Tax rate is required").min(0).max(100),
  search: Yup.string().optional(),
});

const AddTaxForm = () => {
  const [applyTo, setApplyTo] = useState("some");
  const [selectedItems, setSelectedItems] = useState([]);


  const categorizedItems = itemsApiResponse.reduce((acc, item) => {
    const category = item.category ? item.category.name : "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const handleItemSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleCategorySelect = (categoryName) => {
    const categoryItems = categorizedItems[categoryName].map((item) => item.id);
    const allSelected = categoryItems.every((itemId) =>
      selectedItems.includes(itemId)
    );
    setSelectedItems((prev) =>
      allSelected
        ? prev.filter((itemId) => !categoryItems.includes(itemId))
        : [...new Set([...prev, ...categoryItems])]
    );
  };

  return (
    <>
      <Formik
        initialValues={{ name: "", rate: "", search: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const payload = {
            ...values,
            applied_to: applyTo,
            applicable_items: selectedItems,
          };
          console.log(payload);
        }}
      >
        {({ errors, touched }) => (
          <Form
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h1 style={{ textAlign: "start" }}>Add Tax</h1>
            <div style={{ display: "flex", width: "100%" }}>
              <div style={{ width: "70%" }}>
                <Field
                  name="name"
                  type="text"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                {errors.name && touched.name ? (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {errors.name}
                  </div>
                ) : null}
              </div>
              <div
                style={{
                  marginLeft: "30px",
                  width: "30%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Field
                    name="rate"
                    type="number"
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      pointerEvents: "none",
                    }}
                  >
                    %
                  </span>
                </div>
                {errors.rate && touched.rate ? (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {errors.rate}
                  </div>
                ) : null}
              </div>
            </div>
            <div style={{ margin: "20px 0px", display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
              <div>
                <label>
                  <Field
                    type="radio"
                    name="applyTo"
                    value="all"
                    checked={applyTo === "all"}
                    onChange={() => {
                      setApplyTo("all");
                      setSelectedItems(itemsApiResponse.map((item) => item.id));
                    }}
                  />
                  Apply to all items in collection
                </label>
              </div>
              <div>
                <label>
                  <Field
                    type="radio"
                    name="applyTo"
                    value="some"
                    checked={applyTo === "some"}
                    onChange={() => {
                      setApplyTo("some");
                      setSelectedItems([]);
                    }}
                  />
                  Apply to specific items
                </label>
              </div>
            </div>
            <hr style={{ margin: "20px 0px" }} />
            <div style={{ textAlign: "start", margin: "20px 0" }}>
              <Field
                name="search"
                type="text"
                placeholder="Search Items"
                style={{
                  width: "70%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  paddingRight: "30px", 
                }}
              />
            </div>
            {applyTo === "some" && (
              <div style={{ marginBottom: "20px" }}>
                {Object.keys(categorizedItems).map((category) => (
                  <div key={category}>
                    <label
                      style={{
                        display: "block",
                        fontWeight: "bold",
                        background: "#e9ecef",
                        padding: "10px",
                        borderRadius: "4px",
                        marginBottom: "10px",
                        textAlign: 'start'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={categorizedItems[category].every((item) =>
                          selectedItems.includes(item.id)
                        )}
                        onChange={() => handleCategorySelect(category)}
                        style={{ marginRight: "10px" }}
                      />
                      {category}
                    </label>
                    <div style={{ paddingLeft: "20px", textAlign: 'start', margin: '20px 20px' }}>
                      {categorizedItems[category].map((item) => (
                        <label
                          key={item.id}
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleItemSelect(item.id)}
                            style={{ marginRight: "10px" }}
                          />
                          {item.name}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddTaxForm;
