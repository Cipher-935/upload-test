
document.addEventListener("DOMContentLoaded", () => {
  
   const btn_delete = document.querySelector(".delete_btn");
   const btn_get_link = document.querySelector(".get-url");
   const btn_list = document.querySelector(".list_btn");
   const btn_put = document.querySelector('.btn_put');
   const vid_tag = document.getElementById("vid_frame");


   btn_delete.addEventListener("click", async (e) => {
    e.preventDefault();
    const input_key = document.getElementById("del-id").value;
    const obj = {main_key: input_key};
   
    const rec_list = await fetch("http://127.0.0.1:4000/delete", {
        method: "POST",
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify(obj)
    });
    const d_list = await rec_list.json();
    alert(d_list.resp);

   }); 

   btn_get_link.addEventListener("click", async (e) => {
    e.preventDefault();
    const link_key = document.getElementById("file_name").value;
    const s_dat = {get_key: link_key};
    const rec_link = await fetch("http://127.0.0.1:4000/download", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(s_dat)
    });
    if(rec_link.status === 200){
        const final_link = await rec_link.json();
        vid_tag.setAttribute("src", final_link.resp);
    }
    else if(rec_link.status === 404){
        alert(final_link.resp);
    }
   });

   btn_list.addEventListener("click", async (e) => {
      const send = await fetch("http://127.0.0.1:4000/get-list");
      if(send.status === 200){
        const dd = await send.json();
        
        for(let i = 0; i < dd.resp.length; i++){
            console.log(dd.resp[i].Key);
        }
      }
   });

   btn_put.addEventListener("click", async (e) => {
      e.preventDefault();
      const d_file = document.getElementById("d_file");
      const file_desc = document.querySelector(".file_description");
      if(d_file.files.length > 0){
        console.log(d_file.files[0].type);
         const mfile = {file_name: d_file.files[0].name, file_mime: d_file.files[0].type, file_description: file_desc.value, file_size: d_file.files[0].size, file_category: ''};
         const rec_put_link = await fetch("http://127.0.0.1:4000/upload",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(mfile)
         });
         if(rec_put_link.status === 200){
            const final_url = await rec_put_link.json();
            const put_req = await fetch(final_url.resp, {
                method: "PUT",
                headers: {
                    "Content-Type": d_file.files[0].type
                },
                body: d_file.files[0]
            });
            
            if(put_req.status === 200){
                alert("Hey the file was uploaded");
            }
            else{
                alert("Something went wrong");
            }
         }
         else{
            const j_resp = await rec_put_link.json();
            alert(j_resp.resp);
         }
      }
      else{
        alert("File and the description is required");
      }
   });

});