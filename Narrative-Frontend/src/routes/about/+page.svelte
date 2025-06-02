<script>
  import Body from "$lib/Body.svx";
</script>
<main class="w-screen min-h-screen ">
<div class="md:w-1/3 px-10 md:pl-20 pt-20 my-20">
    <a href="/">
  <button class="bg-white !text-black">Go back to the explorer</button>
</a>
  <p class="gap-4 py-6">
    We live in a world where an incredibly wide variety of hate reaches us in
    real life, and online. Some of us are priviliged to spend time reading the
    news about hate. Whereas many of our citizens do not get that privilige.
    This hate is more than just unrelated events, happening on the borders of
    cities and villages to people who we do not know. There exists relationships
    between people, organisations, online accounts and other entities that
    enables this hate. This is across geography, internet, time and countries,
    much of which is not apparent in the deluge of news that we read. This
    geolocated newsmedia archive has been created to illustrate these
    relationships. This is a work in progress. This project has been in the
    making for over 2 intermittent years now.

    <br /><br />
    Thanks to A, A, A, A, V and all the other people who have made this possible in direct
    and indirect ways. Thanks to the work of Hindutva Watch and Alt News.
</p>
   

        <h2>FAQ and notes</h2>
        <ol class="list-decimal space-y-4">
        <li>
            Locations are not accurate. No form of verification has been done after placing the events. They are largely in the right place, by city/state or village/neighbourhood if it is mentioned in the report.
        </li>
        <li>
            Why Hindutva Watch and Alt News? <br/><br>
            Because they appear to be the relatively most comprehensive aggregators of news and other media documenting hate and disinformation.
        </li>
        <li>
            Have the reports been independantly archived to prevent take downs?<br><br>
            No they have not yet been. They have to be archived at the Wayback Machine. 
        </li>
        <li>
            How have the locations been determined?<br><br>
            An LLM was asked to determine only from the report. Each report was fed to the LLM and it would give a list of locations mentioned.
        </li>
        <li>
            Has there been some form of categorisation that has been done? <br><br>
            There has been no categorisation done outside of what Hindutva Watch and Alt News have already done internally.
        </li>
        <li>
            Where can I access the data?<br><br>
            It will be available for download at this page soon.
        </li>
        <li>
            How can I contribute? <br><br>
            email at rungdung@proton.me
        </li>

    </ol>

<h2 id="how-it-works">How it works</h2>

<p>Each report has been fed to an LLM. It was asked to only provide a list of locations mentioned in the report. The list of locations was then used to generate a map. If a news report has multiple locations, then the report is placed in all of the locations</p>
</div>
</main>