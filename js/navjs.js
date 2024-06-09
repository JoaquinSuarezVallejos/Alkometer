$(() => {
    const gaptop = 100;
    const scrollspeed = 1200;
    const menu_active_class = 'active';

    let lastActiveId;
    const header = $("header");
    const navMenu = $('#headnav');
    const navMenuItems = navMenu.find("a");
    const scrollTargets = navMenuItems.map(function() {
        const targetSection = $($(this).attr("href"));
        if (targetSection.length) return targetSection;
    });

    $("#header-menu-toggle").click(function () {
        navMenu.toggleClass("active");
    });    

    navMenuItems.click(function (event) {
        event.preventDefault();

        navMenu.removeClass("active");
        const targetId = $(this).attr("href");
        const targetPosition = "#" === targetId
            ? 0
            : $(targetId).offset().top - 90;
        $("html, body").stop().animate({ scrollTop: targetPosition }, scrollspeed);
    });

    $(window).scroll(function () {
        const navMenuHeight = header.height() + gaptop;
        const windowScrollTop = $(this).scrollTop() + navMenuHeight;
        let currentSection = scrollTargets.map(function() {
            console.log($(this).attr('id'), $(this).offset().top, windowScrollTop);
            if ($(this).offset().top <= windowScrollTop) return this;
        });
        const activeId = (
            (currentSection = currentSection[currentSection.length - 1])
            && currentSection.length)
            ? currentSection[0].id
            : "";

        if (lastActiveId !== activeId) {
            lastActiveId = activeId;
            navMenuItems
                .parent()
                .removeClass(menu_active_class)
                .end()
                .filter("[href='#" + activeId + "']")
                .parent()
                .addClass(menu_active_class);
        }
    });
});

