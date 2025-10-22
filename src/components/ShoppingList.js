import React, { useState, useEffect } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";

function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

useEffect(() => {
  fetch("http://localhost:4000/items")
    .then((r) => r.json())
    .then((data) => setItems(data));
}, []);


  function handleAddItem(newItem) {
     fetch("http://localhost:4000/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newItem),
  })
    .then((r) => r.json())
    .then((savedItem) => setItems([...items, savedItem]));
  }

  function handleToggleItem(itemToToggle) {
      fetch(`http://localhost:4000/items/${itemToToggle.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isInCart: !itemToToggle.isInCart }),
  })
    .then((r) => r.json())
    .then((updatedItem) => {
      const updatedItems = items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
      setItems(updatedItems);
    });
  }

  function handleDeleteItem(id) {
      fetch(`http://localhost:4000/items/${id}`, {
    method: "DELETE",
  }).then(() => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  });
  }

  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="ShoppingList">
      <ItemForm onItemFormSubmit={handleAddItem} />
      <Filter
        category={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ul className="Items">
        {itemsToDisplay.map((item) => (
          <Item
            key={item.id}
            item={item}
            onToggleItem={handleToggleItem}
            onDeleteItem={handleDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
