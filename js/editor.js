function insertNodeAtCursor(node) {
    var range, html;
    if (window.getSelection && window.getSelection().getRangeAt) {
        range = window.getSelection().getRangeAt(0);
        range.insertNode(node);
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        html = (node.nodeType == 3) ? node.data : node.outerHTML;
        range.pasteHTML(html);
    }
}

function saveCursor() {
	var range = false;
    if (window.getSelection && window.getSelection().getRangeAt) {
        range = window.getSelection().getRangeAt(0);        
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
    }
    window.range = range;
}

function insertAtCursor(node) {
	if(!window.range) return false;
	var html;
    if (window.getSelection && window.getSelection().getRangeAt) {        
        range.insertNode(node);
    } else if (document.selection && document.selection.createRange) {       
        html = (node.nodeType == 3) ? node.data : node.outerHTML;
        range.pasteHTML(html);
    }
}

function remove_column() {		
	var row = $(this).parent().parent().parent();
	var cols = row.find('.actual-column').length;
	var span = Math.floor(12 / (cols - 1));
	if(cols > 1){
		$(this).parent().parent().remove();
		var columns = row.find('.actual-column');
		columns.attr('class','span'+span+' actual-column');		
	}
}

function add_column() {
	var row = $(this).parent().parent().find('.actual-row');
	var cols = row.find('.actual-column').length;	
	var span = Math.floor(12 / (cols + 1));
	if(cols < 12){
		row.append($('.template-column').html());
		row.find('.actual-column').attr('class','span'+span+' actual-column');		
	}
}

function generate(){
	var structure = [];
	$('.editor .actual-row').each(function(){
		var row = [];
		$(this).find('.actual-column').each(function(){
			var column = [];
			column.classes = $(this).attr('class');
			column.content = $(this).find('.content').html();
			row.push(column);
		});
		structure.push(row);
	});
	console.log(structure);
}

$(function(){
	$('.preview-toggle').click(function(){
		$(this).toggleClass('on');
		$('.editor').toggleClass('preview');
		return false;
	});
	$('.format-switch li a').click(function(){
		var li = $(this).parent();
		$('.editor').removeClass('desktop phone tablet').addClass(li.data('format'));
		$('.format-indicator').text(li.data('format'));
		return false;
	});
	$('.generate').click(generate);
	$('.add-row').live('click',function(){
		$(this).before($('.template-erow').html());		
	});
	$('.add-column').live('click',add_column);
	$('.column-controls .remove').live('click',remove_column);
	$('.actual-column .content.placeholder').live('focus',function(){
		$(this).text('').removeClass('placeholder');
	});
	$('.actual-column .content').live('focus',function(){
		$(this).addClass('active');
		var controls = $('.content-controls');
		controls.removeClass('hide');
		var offset = $(this).offset();
		var top = offset.top - controls.outerHeight() - 10;
		var left = offset.left + ($(this).outerWidth() / 2) - Math.floor(controls.outerWidth() / 2);
		controls.css({
			top: top,
			left: left
		});
	}).live('blur',function(){
		window.hideTimer = setTimeout(function(){
			$('.content-controls').addClass('hide');			
		}, 200);
		console.log('started');
	}).live('keyup',saveCursor).live('click',saveCursor);
	$('.content-controls, .content').live('mousedown',function(){
		console.log('clicked controls');
		setTimeout(function(){
			clearTimeout(window.hideTimer);
			console.log('stopped');
		}, 50);
	});
});