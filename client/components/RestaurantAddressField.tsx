'use client';

import { useEffect, useRef, useState } from 'react';

type PlaceWidget = HTMLElement & { placeholder: string };
type PlacesLibrary = { PlaceAutocompleteElement: new () => PlaceWidget };
type GoogleWindow = Window & {
    google?: { maps?: { importLibrary: (name: string) => Promise<PlacesLibrary> } };
    __restaurantAddressPlacesReady?: () => void;
};

let placesPromise: Promise<PlacesLibrary> | null = null;

function loadPlaces(apiKey: string): Promise<PlacesLibrary> {
    if (placesPromise) return placesPromise;
    const mapsWindow = window as GoogleWindow;
    placesPromise = new Promise<PlacesLibrary>((resolve, reject) => {
        const finish = () => {
            delete mapsWindow.__restaurantAddressPlacesReady;
            const maps = mapsWindow.google?.maps;
            if (!maps?.importLibrary) {
                placesPromise = null;
                reject(new Error('Google Places is unavailable'));
                return;
            }
            void maps.importLibrary('places').then(resolve, (error) => {
                placesPromise = null;
                reject(error);
            });
        };
        if (mapsWindow.google?.maps?.importLibrary) {
            finish();
            return;
        }
        mapsWindow.__restaurantAddressPlacesReady = finish;
        const script = document.createElement('script');
        const params = new URLSearchParams({ key: apiKey, v: 'weekly', loading: 'async', libraries: 'places', callback: '__restaurantAddressPlacesReady' });
        script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
        script.async = true;
        script.onerror = () => {
            delete mapsWindow.__restaurantAddressPlacesReady;
            placesPromise = null;
            reject(new Error('Google Places could not load'));
        };
        document.head.appendChild(script);
    });
    return placesPromise;
}

export function RestaurantAddressField({ id, value, onChange, inputClassName, labelClassName }: {
    id: string;
    value: string;
    onChange: (address: string) => void;
    inputClassName: string;
    labelClassName: string;
}) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const widgetHost = useRef<HTMLDivElement>(null);
    const onChangeRef = useRef(onChange);
    const [suggestionsFailed, setSuggestionsFailed] = useState(false);

    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

    useEffect(() => {
        if (!apiKey || !widgetHost.current) return;
        let active = true;
        let widget: PlaceWidget | null = null;
        const onSelect = async (event: Event) => {
            const selection = event as Event & {
                placePrediction?: { toPlace: () => { formattedAddress?: string; fetchFields: (options: { fields: string[] }) => Promise<void> } };
            };
            if (!selection.placePrediction) return;
            try {
                const place = selection.placePrediction.toPlace();
                await place.fetchFields({ fields: ['formattedAddress'] });
                if (active && place.formattedAddress) onChangeRef.current(place.formattedAddress);
            } catch {
                if (active) setSuggestionsFailed(true);
            }
        };

        void loadPlaces(apiKey).then(({ PlaceAutocompleteElement }) => {
            if (!active || !widgetHost.current) return;
            widget = new PlaceAutocompleteElement();
            widget.placeholder = 'Search your restaurant on Google Maps';
            widget.style.display = 'block';
            widget.style.width = '100%';
            widget.addEventListener('gmp-select', onSelect);
            widgetHost.current.appendChild(widget);
        }).catch(() => { if (active) setSuggestionsFailed(true); });

        return () => {
            active = false;
            widget?.removeEventListener('gmp-select', onSelect);
            widget?.remove();
        };
    }, [apiKey]);

    return (
        <div>
            <label htmlFor={id} className={labelClassName}>Restaurant Address</label>
            {apiKey && !suggestionsFailed && <><p className="mb-1.5 text-xs font-medium text-slate-600">Find with Google Maps</p><div ref={widgetHost} className="mb-2 w-full" aria-label="Search address with Google Maps" /></>}
            <input id={id} name="address" type="text" autoComplete="street-address" maxLength={300} required value={value} onChange={(event) => onChange(event.target.value)} placeholder="Street, area, city, state and PIN code" className={inputClassName} />
            <p className="mt-1.5 text-xs text-slate-500">{apiKey && !suggestionsFailed ? 'Choose a Google suggestion above or enter the full address here.' : 'Enter the full restaurant address.'}</p>
        </div>
    );
}
