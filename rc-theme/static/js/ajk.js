(function($){
    $(document).ready(function(){
       $('.rc-code').each(function(){
           /** Get rid of the first newline **/
           $(this).html($(this).html().replace(/\n/,''));
     
           /** Get rid of the stupid brs **/
           $(this).html($(this).html().replace(/<br\s*\/?>/g,''));
           
           /** Get rid of leading spaces that are required to keep markdown from processing **/
           $(this).html($(this).html().replace(/^     /,""));
           $(this).html($(this).html().replace(/\n     /g,"\n"));
           $(this).html($(this).html().replace(/^    /,""));
           $(this).html($(this).html().replace(/\n    /g,"\n"));
       });
       $('ul.toc_list').fadeOut();
       $('.toc_title').append('<span class="toc_vis">&gt;</span>');

       $('#toc_container').mouseover(function(){
          $(this).find('.toc_vis').each(function(){
              $(this).html('v');
          });
          $(this).find('ul.toc_list').each(function(){
              $(this).show();
              $(this).stop();
          });
       });
       $('#toc_container').mouseout(function(){
          $(this).find('.toc_vis').each(function(){
              $(this).html('&gt;');
          });
          $(this).find('ul.toc_list').each(function(){
              $(this).fadeOut();
          });
       });

       //Dont think I need this
//       $('ul.toc_list').find('a').each(function(){
//           $(this).click(function(){
//               console.log('clicked');
//               $(this).parents('ul.toc_list').hide();
//           });
//       });
       $("a[data-toggle='modal']").click(function(){
          console.log($(this).parent().next().html());
          html = $(this).parent().next().html();
          $("#dialog-box-body").html(html);
       });
    });
})(jQuery)
