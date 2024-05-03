document.addEventListener("DOMContentLoaded", async () => {
    
    const make_template = function(files, name){
        const greet_tag = document.getElementById("g_mess");
        greet_tag.textContent = `Hello ${name} welcome back`;

        const display_frame = document.querySelector(".main_frame");
        if(files.length > 0){
            for(let i=0; i < files.length; i++){
                const utc_date = new Date(files[i].uploaded_file_date);
                const local_d = utc_date.toLocaleDateString();
                const data_div = document.createElement("div");
                const data_html = `
           
                <div class = 'd_div'> <h3>File Name</h3> <h3 style="width: 200px;">${files[i].uploded_file_name}</h3></div>
                <div class = 'd_div'><h3>Description</h3>  <h3 class="des_content">${files[i].uploaded_file_description}</h3></div>
                <h3 style="width: 240px; text-align: center;"><div class = 'd_div'> ${local_d} </div></h3>
                <h3 style="width: 240px; text-align: center;"><div class = 'd_div'>${files[i].uploaded_file_category} </div></h3>
                <div class="span-buttons">
                   <button class="icon-button" id="viewButton" view-file=${files[i].uploaded_file_storage_location}></button>
                   <button class="icon-button" id="deleteButton" delete-file=${files[i].uploded_file_name}></button>
                   <button class="icon-button" id="shareButton" share-file=${files[i].uploaded_file_storage_location}></button>
                </div> `;
                data_div.innerHTML = data_html;
                data_div.classList.add("data-item");  
                display_frame.appendChild(data_div);  
            }
        }
        else{
            const tag = document.createElement("h1");
            tag.innerHTML = `<p style='text-align:center'>It seems you haven't uploaded any file yet, you can do it from Uploads Tab.<p>`;
            display_frame.appendChild(tag);
        }
    }
    
    const rec_dat = await fetch("http://127.0.0.1:4000/list");
    if(rec_dat.status === 200){
        const final_data = await rec_dat.json();
        make_template(final_data.all_files, final_data.f_name);
    }
    else{
        console.log("Some error");
    }
    
    const all_delete_btns = document.querySelectorAll("#deleteButton");
    all_delete_btns.forEach(btn => {
        btn.addEventListener("click", async (e) => {
             e.preventDefault();
             const key_val = btn.getAttribute("delete-file");
             const obj = {main_key: key_val};
             const del_command = await fetch("http://127.0.0.1:4000/delete", {
                      method: "POST",
                      headers: {"Content-Type": "application/json"}, 
                      body: JSON.stringify(obj)
             });
             if(del_command.status === 200){
                location.reload();
             }
             
        });
    });

    const all_view_buttons = document.querySelectorAll("#viewButton");
    all_view_buttons.forEach(btn => {
        btn.addEventListener("click", async (e) => {
             e.preventDefault();
             const key_val = btn.getAttribute("view-file");
             const obj = {get_key: key_val};
             const view_command = await fetch("http://127.0.0.1:4000/download", {
                      method: "POST",
                      headers: {"Content-Type": "application/json"}, 
                      body: JSON.stringify(obj)
             });
             
             const view_message = await view_command.json();
             const link = document.createElement('a');
             link.href = view_message.resp;
             link.download = "test_down.jpeg";
             link.click();
        });
    });

    const all_share_btns = document.querySelectorAll("#shareButton");
    all_share_btns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const display_frame = document.querySelector(".main_frame");
            const hidden_form = document.querySelector(".hidden_mailer");
            const val_feed =  document.getElementById("f_key");
            val_feed.value = btn.getAttribute("share-file");
            display_frame.style.opacity = '0.4'
            hidden_form.style.display = 'flex';
        });
    });

    const btn_send = document.querySelector(".btn_send_mail");
        btn_send.addEventListener("click", async (e) => {
        e.preventDefault();
        const file = document.getElementById("f_key").value;
        const email_id = document.getElementById("email_input").value;
        const valid_time = document.getElementById("validity").value;
        const send_mail = await fetch("http://127.0.0.1:4000/share_link", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({r_id: email_id, v_time: valid_time, get_key: file})
        });
        if(send_mail.status === 200){
            const result = await send_mail.json()
            alert(result.resp);
        }
        else{
            alert("Some error occured");
        }
    });
     
});
