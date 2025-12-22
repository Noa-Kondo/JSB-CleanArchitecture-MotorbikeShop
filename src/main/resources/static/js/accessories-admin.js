// accessories-admin.js
console.log("ACCESSORIES-ADMIN.JS LOADED");

const API_BASE_URL = "http://localhost:8080/api/accessories";

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded");
    updateAdminName();
    loadAccessories();
});

function updateAdminName() {
    const username = sessionStorage.getItem("username") || "Admin";
    document.getElementById("adminName").textContent = username;
}

function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(value || 0);
}

async function loadAccessories() {
    console.log("Loading accessories...");
    const tbody = document.getElementById("accessoryTableBody");

    try {
        console.log("Fetching from: " + API_BASE_URL);
        const res = await fetch(API_BASE_URL);
        const data = await res.json();
        
        console.log("Response:", data);

        // Kiểm tra xem data có phải là array không
        if (!Array.isArray(data)) {
            console.error("Data is not an array:", data);
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align:center; padding: 30px; color:#999;">
                        Không có phụ kiện nào
                    </td>
                </tr>`;
            return;
        }

        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align:center; padding: 30px; color:#999;">
                        Không có phụ kiện nào
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = data.map(accessory => `
          <tr>
              <td>${accessory.id}</td>
              <td>
                  <img src="${accessory.imageUrl}" class="motorbike-img" style="max-width: 50px; height: auto;">
              </td>
              <td><strong>${accessory.name}</strong></td>
              <td>${accessory.type}</td>
              <td>${accessory.brand}</td>
              <td>${accessory.material}</td>
              <td>${accessory.size}</td>
              <td>${accessory.stock}</td>
              <td>${formatCurrency(accessory.price)}</td>
              <td class="actions">
                  <button class="btn-edit" onclick="editAccessory(${accessory.id})">✏️ Sửa</button>
                  <button class="btn-delete" onclick="deleteAccessory(${accessory.id})">🗑 Xóa</button>
              </td>
          </tr>
      `).join("");

    } catch (err) {
        console.error("Load error:", err);
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center; padding: 30px; color:#e74c3c;">
                    Lỗi khi tải dữ liệu: ${err.message}
                </td>
            </tr>`;
    }
}

async function searchAccessories() {
    const keyword = document.getElementById("keyword").value.trim();
    const type = document.getElementById("type").value.trim();
    const brand = document.getElementById("brand").value.trim();
    const material = document.getElementById("material").value.trim();
    const minPrice = document.getElementById("minPrice").value.trim();
    const maxPrice = document.getElementById("maxPrice").value.trim();

    if (!keyword && !type && !brand && !material && !minPrice && !maxPrice) {
        loadAccessories();
        return;
    }

    const tbody = document.getElementById("accessoryTableBody");
    tbody.innerHTML = `<tr><td colspan="10" style="padding:25px;text-align:center;color:#666;">Đang tìm kiếm...</td></tr>`;

    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (type) params.append("type", type);
    if (brand) params.append("brand", brand);
    if (material) params.append("material", material);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    try {
        const res = await fetch(`${API_BASE_URL}/search?` + params.toString());
        const data = await res.json();

        // Kiểm tra xem data có phải là array không
        if (!Array.isArray(data)) {
            console.error("Data is not an array:", data);
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="padding:25px; text-align:center; color:#999;">
                        Không tìm thấy phụ kiện nào phù hợp
                    </td>
                </tr>`;
            return;
        }

        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="padding:25px; text-align:center; color:#999;">
                        Không tìm thấy phụ kiện nào phù hợp
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td><img src="${item.imageUrl}" class="motorbike-img" style="max-width: 50px; height: auto;"></td>
                <td><strong>${item.name}</strong></td>
                <td>${item.type}</td>
                <td>${item.brand}</td>
                <td>${item.material}</td>
                <td>${item.size}</td>
                <td>${item.stock}</td>
                <td>${formatCurrency(item.price)}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="editAccessory(${item.id})">✏️ Sửa</button>
                    <button class="btn-delete" onclick="deleteAccessory(${item.id})">🗑 Xóa</button>
                </td>
            </tr>
        `).join("");
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="10" style="padding:25px; text-align:center; color:red;">Lỗi khi tìm kiếm</td></tr>`;
    }
}

function editAccessory(id) {
    window.location.href = `edit-accessory.html?id=${id}`;
}

async function deleteAccessory(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa phụ kiện này?")) {
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            const err = await res.json();
            showToast("❌ " + (err.errorMessage || "Lỗi khi xóa"), "error");
            return;
        }

        showToast("✔ Xóa thành công!", "success");
        loadAccessories();

    } catch (err) {
        console.error(err);
        showToast("⚠ Không thể kết nối server!", "error");
    }
}
