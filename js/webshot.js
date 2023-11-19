
$(document).ready(function() {

    $('.webshot_file').change(function() {
        var fileCount = this.files.length;
        let file_selected_elem = $(this).siblings('.file_selected').text('file selected');
        if(fileCount > 0){
        	$('.upload_image_label').hide();	
        	file_selected_elem.text('file selected').show();
        	var file = $(this)[0].files[0];
	    	var reader = new FileReader();
	    	reader.onload = function() {
	            var dataURL = reader.result;
	            $('.image_main_tre img').attr('src',dataURL);
	            $('.loader_main_box').find('.img_loader img').attr('src',dataURL);
	            $('.image_main_tre').show();
	        };
	        reader.readAsDataURL(file);
        }else{
        	file_selected_elem.empty().hide();
        }
    });
});

$(document).off('click',".edit_btn");
$(document).on('click',".edit_btn", function(){
	$(this).closest('.image_main_tre').siblings('.upload_image_label').trigger('click');
});
$(document).off('click',".try_btn");
$(document).on('click',".try_btn", function(){
	reset_page_content();
});
$(document).off('click',".input_bx_check");
$(document).on('click',".input_bx_check", function(){
	let elem = $(this);
	// console.log(elem.find('input').is(':checked'));
	if(elem.find('input').is(':checked')){
		elem.closest('.main_flex_tab').addClass('uncheck_list');
	}
});
$(document).off('click',".uplod_btn");
$(document).on('click',".uplod_btn", function(){
	let uplod_btn = $(this);
	
	let fileInput = uplod_btn.closest('.main_block_tr').siblings('.webshot_file')[0];
    let rqst_msg = uplod_btn.siblings('.rqst_msg');
    let container = uplod_btn.closest('.open_ai_query').siblings('.open_ai_success');
    var file = fileInput.files[0];
    if (file) {
    	var reader = new FileReader();
    	reader.onload = function() {
            var dataURL = reader.result;
            uplod_btn.closest('.upload_file_content').siblings('.loader_main_box').find('.img_loader img').attr('src',dataURL);
            container.find('.side_screenshot_menu img').attr('src',dataURL);
            // $('#previewImage').attr('src', dataURL);
        };
        reader.readAsDataURL(file);
    	uplod_btn.closest('.upload_file_content').hide();
    	
    	uplod_btn.closest('.upload_file_content').siblings('.loader_main_box').show();
        var formData = new FormData();
        // return false;
        formData.append('webshot_file', file);
        $.ajax({
            url: 'api/index.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                let json_data = JSON.parse(response);
                if(!json_data.success){
                	uplod_btn.closest('.upload_file_content').siblings('.loader_main_box').hide();
                	uplod_btn.closest('.upload_file_content').siblings('.try_agin_btn').find('.error_msg').text(json_data.msg);
                	uplod_btn.closest('.upload_file_content').siblings('.try_agin_btn').show();
                	
			    	setTimeout(function() {
					    rqst_msg.empty().hide();
					}, 2000);
                }else{
                	uplod_btn.closest('.upload_file_content').siblings('.loader_main_box').hide();
                	uplod_btn.closest('.open_ai_query').hide();
                	let ctr_score = (json_data.data.score) ? parseInt(json_data.data.score) : 0;
                	let circle_main_cls = (ctr_score > 89) ? 'progress_success' : 
                							(ctr_score > 49  && ctr_score <= 89) ? `progress_medium` : `progress_danger`;
                	container.find('.progress_circle').attr('stroke-dasharray',`${ctr_score},100`);
                	container.find('.circle_main').removeClass('progress_success progress_medium progress_danger');
                	container.find('.circle_main').addClass(circle_main_cls);

                	container.find('.progress_circle_text').text(json_data.data.score);
                	let elem = $(`<div class="main_flex_tab">
	                        <div class="check-data clr-green">
	                          <svg
	                            width="18px"
	                            height="18px"
	                            fill="currentColor"
	                            xmlns="http://www.w3.org/2000/svg"
	                            height="1em"
	                            viewBox="0 0 512 512"
	                          >
	                            <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
	                            <path
	                              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
	                            />
	                          </svg>
	                        </div>
	                        <div>
	                          <h4 class="txt_main_blkdr">
	                          </h4>
	                          <span class="txt_main_blkdr_info">
	                          </span>
	                        </div>
	                    </div>`);
	                // console.log(json_data.data.positives.length);
                	if(json_data.data.positives.length > 0){
                		container.find('.positive_points').find('.positive_list').empty();
                		json_data.data.positives.map(function (positives) {
                			let elem_positive = elem.clone();
                			elem_positive.find('.txt_main_blkdr').text(positives.heading);
                			elem_positive.find('.txt_main_blkdr_info').text(positives.info);
                			container.find('.positive_points').find('.positive_list').append(elem_positive);
                		})
                		container.find('.positive_points').find('.positive_list').show();
                	}else{
                		container.find('.positive_points').hide();
                	}
                	if(json_data.data.improvements.length > 0){
                		container.find('.improvement_points').find('.improve_list').empty();
                		json_data.data.improvements.map(function (improvements) {
                			let elem_improve = $(`<div class="main_flex_tab">
		                        <div class="check-data clr-red">
		                          <div class="input_bx_check">
		                            <input id="c2" type="checkbox" />
		                          </div>
		                        </div>
		                        <div class="check_list_tab">
		                          <h4 class="txt_main_blkdr">
		                          	${improvements.heading}
		                          </h4>
		                          <span class="txt_main_blkdr_info">
		                          	${improvements.info}
		                          </span>
		                        </div>
		                      </div>`);
                			container.find('.improvement_points').find('.improve_list').append(elem_improve);
                		})
                		container.find('.improvement_points').find('.improve_list').show();
                	}else{
                		container.find('.improvement_points').hide();
                	}
                	container.show();
                }
            },
            error: function(error) {
                console.error('File upload failed:', error);
            }
        });
    } else {
    	rqst_msg.text('No file selected');
    	setTimeout(function() {
		    rqst_msg.empty().hide();
		}, 2000);
    	
    }

})

function reset_page_content(){
	$('.open_ai_query').show();
	$('.open_ai_success').hide();
	$('.upload_file_content').show();
    $('.loader_main_box').hide();
    $('.file_selected').hide();
    $('.try_agin_btn').hide();
    $('.image_main_tre').hide();
    $('.upload_file_form')[0].reset();
    $('.upload_image_label').show();
}