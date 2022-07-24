const { createClient } = supabase;
const _supabase = createClient(
  "https://snbutcswqsvawuqudgeg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NDAwNDc4MCwiZXhwIjoxOTU5NTgwNzgwfQ.MDGminr2I41V3lBjf-4oDCb-jIrYtOa2yu03ZLgR_Jk"
);

$("#saveMemberInfo").submit(async function (event) {
  event.preventDefault();
  const keys = ["reg_no", "owner_name", "email", "slot"];
  const obj = {};
  keys.forEach((item, index) => {
    const result = document.getElementById(item).value;
    if (result) {
      obj[item] = result;
    }
  });

  const { data, error } = await _supabase.from("parking_lot").insert([obj]);

  if (error) console.log(error);

  setTimeout(() => {
    $('#cancel-modal').click();
    getTableData();
  }, 100)

  return false;
});

const getTableData = async () => {
  $("#member_table").find("tr:not(:first)").remove();
  const searchKeyword = $("#member_search").val();
  const members = await getMembers();
  const filteredMembers = members.filter(
    ({ reg_no, owner_name, email, slot, id }, index) =>
      reg_no.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      owner_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      slot.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  if (!filteredMembers.length) {
    $(".show-table-info").removeClass("hide");
  } else {
    $(".show-table-info").addClass("hide");
  }
  filteredMembers.forEach((item, index) => {
    insertIntoTableView(item, index + 1);
  });
};

const deleteMemberData = async (item) => {
  console.log(item)
  const { data, error } = await _supabase
    .from("parking_lot")
    .delete()
    .match({ id: item });

  if (error) console.log(error.message);

  getTableData()
};

function insertIntoTableView(item, tableIndex) {
  const table = document.getElementById("member_table");
  const row = table.insertRow();
  const idCell = row.insertCell(0);
  const firstNameCell = row.insertCell(1);
  const lastNameCell = row.insertCell(2);
  const emailCell = row.insertCell(3);
  const slotCell = row.insertCell(4);
  const actionCell = row.insertCell(5);
  idCell.innerHTML = tableIndex;
  firstNameCell.innerHTML = item.reg_no;
  lastNameCell.innerHTML = item.owner_name;
  emailCell.innerHTML = item.email;
  slotCell.innerHTML = `<span class="tag">${item.slot}</span>`;
  const guid = item.id;
  actionCell.innerHTML = `<button class="btn btn-sm btn-danger" onclick="deleteMemberData(${item.id})">Delete</button>`;
}

const getMembers = async () => {
  const { data: value, error } = await _supabase
    .from("parking_lot")
    .select("*");

  return value;
};

getTableData();
