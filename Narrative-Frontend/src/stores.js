import { writable } from 'svelte/store';
import { onDestroy } from 'svelte';
import { onMount } from "svelte";
import { persisted } from 'svelte-local-storage-store';
import {get} from 'svelte/store';
import { nodes } from './SelectedFeatures.svelte'
  
const retrieved = localStorage.getItem("storedFeatures");
const parsed = JSON.parse(retrieved)
export const selectedFeatures = writable(parsed === null ? [] : parsed)


selectedFeatures.subscribe(value => {
    localStorage.setItem("storedFeatures", JSON.stringify(value))
});

