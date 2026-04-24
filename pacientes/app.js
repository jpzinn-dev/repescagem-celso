document.addEventListener("DOMContentLoaded", () => {

  const supabase = window.supabase.createClient(
    'https://velhdmaghzvzbmngfwdw.supabase.co',
    'sb_publishable_jzxdT7D5svHWuXU--k2aLg_acPKiza5'
  );

  const form = document.getElementById('form-paciente');
  const lista = document.getElementById('lista-pacientes');
  const msg = document.getElementById('msg');


  async function carregarPacientes() {
    lista.innerHTML = "";

    const { data, error } = await supabase
      .from('pacientes')
      .select('*');

    if (error) {
      console.log(error);
      return;
    }

    data.forEach(p => {
      const div = document.createElement('div');
      div.classList.add('paciente');

      div.innerHTML = `
        <input type="text" value="${p.nome}" id="nome-${p.id}">
        <input type="text" value="${p.celular}" id="cel-${p.id}">
        <button onclick="editar(${p.id})">Editar</button>
        <button onclick="excluir(${p.id})">Excluir</button>
      `;

      lista.appendChild(div);
    });
  }

 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const celular = document.getElementById('celular').value;

    const { error } = await supabase
      .from('pacientes')
      .insert([{ nome, celular }]);

    if (error) {
      msg.innerText = "Erro ao cadastrar";
      msg.style.color = "red";
    } else {
      msg.innerText = "Cadastrado com sucesso!";
      msg.style.color = "green";
      form.reset();
      carregarPacientes();
    }
  });


window.editar = async (id) => {
  const nome = document.getElementById(`nome-${id}`).value;
  const celular = document.getElementById(`cel-${id}`).value;

  console.log("Tentando atualizar:", { id, nome, celular });

  const { data, error } = await supabase
    .from('pacientes')
    .update({ nome, celular })
    .eq('id', id)
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    alert("Erro: " + error.message);
  } else if (!data || data.length === 0) {
    alert("Nada foi atualizado (verifique o ID ou policy)");
  } else {
    alert("Atualizado!");
    carregarPacientes();
  }
};

 
  window.excluir = async (id) => {
    const { error } = await supabase
      .from('pacientes')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Erro ao excluir");
    } else {
      alert("Excluído!");
      carregarPacientes();
    }
  };

  carregarPacientes();

});