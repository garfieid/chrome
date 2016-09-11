$(function() {
	var bingUrl = "http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc=1473556652781&pid=hp&video=1";
	$.get(bingUrl, function(data, status) {
		if ("success" == status) {
			var url = data.images[0].url;
			if (url.charAt(0) == '/') {
				url = "http://s.cn.bing.net" + url;
			}
			var title = data.images[0].copyright;
			$("#bgDiv").attr("title", title);
			$("#bgDiv").css("background-image", "url(" + url + ")");
			$("#bgDiv").css('opacity', 0);
			$("#bgDiv").stop().animate({
				opacity : '1'
			}, 600);
		}
	});

	$("#bgDiv").click(function() {
		var flag = $("#searchDiv").css("visibility");
		if ("hidden" == flag) {
			$("#searchDiv").css("visibility", "visible");
			$("#searchInput").focus();
		} else {
			$("#searchDiv").css("visibility", "hidden");
		}
	});

	$("#searchInput").click(function(e) {
		e.stopPropagation();
	});

	$("#bookMarkBtn").click(function(e) {
		chrome.bookmarks.getTree(function(nodes) {
			var popDiv = $("#popDiv");
			var showed = (popDiv.attr("data") == "bookmark");
			$("#popDiv").empty();
			popDiv.attr("data","");
			if (!showed) {
				showBookmarks(nodes);
				popDiv.attr("data","bookmark");
			}
		});
		e.stopPropagation();
	});

});

function showBookmarks(nodes) {
	var bmDiv = $("<div id='bmDiv'></div>");
	$("#popDiv").append(bmDiv);
	var tabsDiv = $("<div id='bmTabsDiv'></div>");
	bmDiv.append(tabsDiv);
	bmDiv.append('<div style="clear: both;"></div>');
	for ( var i = 0; i < nodes[0].children.length; i++) {
		var node = nodes[0].children[i];
		var tabDiv = $('<div data="' + node.id + '" style="float:left;">'
				+ node.title + '</div>');
		tabsDiv.append(tabDiv);
		var bmUl = $('<ul data="' + node.id + '" class="bm_ul"></ul>');
		if (i != 0) {
			bmUl.css("display", "none");
		}
		bmDiv.append(bmUl);
		for ( var j = 0; j < node.children.length; j++) {
			var bm = node.children[j];
			var li = $('<li><a href="' + bm.url + '">' + bm.title + '</a></li>');
			bmUl.append(li);
		}
		tabDiv.mouseover(function() {
			var nodeId = $(this).attr("data");
			$(".bm_ul").each(function() {
				if ($(this).attr("data") == nodeId) {
					$(this).css("display", "block");
				} else {
					$(this).css("display", "none");
				}
			});
		});
	}
}