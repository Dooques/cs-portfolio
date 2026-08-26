// Scrollspy behavior for the sticky section nav:
//  - shows the bar once the given "past" element (the "My Journey"
//    heading) scrolls out of view, hides it again when scrolled back
//    above it
//  - highlights whichever tracked section is currently most in view
// All DOM work stays in JS — no calls back into .NET — so scrolling
// never round-trips through the Blazor Server circuit.

let observers = [];

export function init(pastElementId, sectionIds) {
    dispose(); // guard against double-init (e.g. Blazor Server reconnect)

    const nav = document.querySelector('.section-nav');
    const pastElement = document.getElementById(pastElementId);
    if (!nav || !pastElement) {
        return;
    }

    const visibilityObserver = new IntersectionObserver(
        ([entry]) => {
            // isIntersecting alone can't tell "scrolled past it" apart from
            // "haven't scrolled down to it yet" — both read as false. Only
            // show the nav once the element's top edge has gone above the
            // viewport.
            const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
            nav.classList.toggle('section-nav--visible', scrolledPast);
        },
        { threshold: 0 }
    );
    visibilityObserver.observe(pastElement);
    observers.push(visibilityObserver);

    const links = new Map(
        sectionIds
            .map(id => [id, nav.querySelector(`.section-nav__link[data-target="${id}"]`)])
            .filter(([, link]) => link)
    );

    const setActive = (id) => {
        for (const [sectionId, link] of links) {
            link.classList.toggle('section-nav__link--active', sectionId === id);
        }
    };

    // IntersectionObserver only reports entries whose state changed in a
    // given batch, not every observed element — so track membership
    // ourselves rather than trusting a single callback's entry list.
    const intersecting = new Set();

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    intersecting.add(entry.target.id);
                } else {
                    intersecting.delete(entry.target.id);
                }
            }

            // Prefer the section furthest down the page among those
            // currently crossing the line, so a short section (e.g. Tech
            // Stack) can't get skipped over when scrolling fast.
            for (let i = sectionIds.length - 1; i >= 0; i--) {
                if (intersecting.has(sectionIds[i])) {
                    setActive(sectionIds[i]);
                    break;
                }
            }
        },
        // A thin activation line just below the fixed nav bar, rather
        // than a wide band — a section only goes active once it's
        // actually surfacing from under the bar, not merely somewhere in
        // the upper third of the screen.
        { rootMargin: '-80px 0px -85% 0px', threshold: 0 }
    );

    for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
            sectionObserver.observe(element);
        }
    }
    observers.push(sectionObserver);

    // The last section (Contact) is short enough that its midpoint never
    // crosses the activation line above, so the intersection logic alone
    // can leave the bar showing nothing — or the wrong section — once
    // you've scrolled all the way down. Force the last section active at
    // the bottom of the page as a fallback.
    const lastSectionId = sectionIds[sectionIds.length - 1];
    const onScroll = () => {
        const atBottom = window.innerHeight + Math.ceil(window.scrollY)
            >= document.documentElement.scrollHeight;
        if (atBottom) {
            setActive(lastSectionId);
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    observers.push({ disconnect: () => window.removeEventListener('scroll', onScroll) });
}

export function dispose() {
    for (const observer of observers) {
        observer.disconnect();
    }
    observers = [];
}
