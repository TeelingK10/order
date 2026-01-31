if (!localStorage.getItem("currentSeat")) {
  localStorage.setItem("currentSeat", "A");
}

/* ===== 共通 ===== */

function getSeat() {
  return localStorage.getItem("currentSeat");
}

function getOrders(seat = getSeat()) {
  return JSON.parse(localStorage.getItem("orders_" + seat)) || [];
}

function setOrders(o, seat = getSeat()) {
  localStorage.setItem("orders_" + seat, JSON.stringify(o));
}

function getTotal(seat = getSeat()) {
  return Number(localStorage.getItem("total_" + seat)) || 0;
}

function setTotal(v, seat = getSeat()) {
  localStorage.setItem("total_" + seat, v);
}

/* 累計売上 */

function getSales() {
  return Number(localStorage.getItem("sales_total")) || 0;
}

function addSales(v) {
  localStorage.setItem("sales_total", getSales() + v);
}

/* ===== 席切替 ===== */

function changeSeat(seat) {
  localStorage.setItem("currentSeat", seat);
  updateOrderList();
  updateTotalDisplay();
}

/* ===== 注文追加 ===== */

function addItem(name, price) {
  const orders = getOrders();
  orders.push({ name, price });
  setOrders(orders);

  setTotal(getTotal() + price);
  addSales(price);

  updateOrderList();
  updateTotalDisplay();
}

function addManualItem() {
  const name =
    document.getElementById("item-name").value || "オリジナルカクテル";
  const price = Number(document.getElementById("item-price").value);
  if (!price) return;

  addItem(name, price);

  document.getElementById("item-name").value = "";
  document.getElementById("item-price").value = "";
}

function addCharge() {
  addItem("チャージ", 500);
}

/* ===== 注文削除 ===== */

function deleteItem(index) {
  const orders = getOrders();
  const removed = orders.splice(index, 1)[0];

  setOrders(orders);
  setTotal(getTotal() - removed.price);
  addSales(-removed.price);

  updateOrderList();
  updateTotalDisplay();
}

/* ===== 表示 ===== */

function updateOrderList() {
  const list = document.getElementById("order-list");
  if (!list) return;

  list.innerHTML = "";

  getOrders().forEach((o, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${o.name} ¥${o.price}
      <button onclick="deleteItem(${i})">削除</button>
    `;
    list.appendChild(li);
  });
}

function updateTotalDisplay() {
  const seatLabel = document.getElementById("seat-name");
  const totalLabel = document.getElementById("total-price");
  if (!seatLabel || !totalLabel) return;

  seatLabel.textContent = "席：" + getSeat();
  totalLabel.textContent =
    "合計金額：¥" + getTotal().toLocaleString();
}

/* ===== 会計リセット ===== */

function resetTotal() {
  const seat = getSeat();
  localStorage.setItem("orders_" + seat, JSON.stringify([]));
  localStorage.setItem("total_" + seat, 0);
  updateOrderList();
  updateTotalDisplay();
}

/* ===== 売上 ===== */

function showSales() {
  const list = document.getElementById("sales-list");
  if (!list) return;

  list.innerHTML = "";
  const li = document.createElement("li");
  li.textContent = "累計売上：¥" + getSales().toLocaleString();
  list.appendChild(li);
}

function resetSales(){
  // 売上リセット
  localStorage.setItem("sales_total", 0);

  // 全席を初期化
  ["A","B","C"].forEach(seat=>{
    localStorage.setItem("total_"+seat, 0);
    localStorage.setItem("orders_"+seat, JSON.stringify([]));
  });

  updateTotalDisplay();
  updateOrderList();
  showSales(); 

}
/* ===== 初期 ===== */

window.onload = () => {
  updateOrderList();
  updateTotalDisplay();
  showSales();
};
