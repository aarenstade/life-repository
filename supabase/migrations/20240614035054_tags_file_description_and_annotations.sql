create table "public"."file_annotations" (
    "id" bigint generated by default as identity not null,
    "file_id" uuid not null,
    "category" text not null,
    "sub_category" text not null,
    "detail" text not null,
    "value" text not null,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text)
);


create table "public"."file_descriptions" (
    "id" bigint generated by default as identity not null,
    "file_id" uuid not null,
    "manual_description" text,
    "generated_description" text,
    "generated_description_model" text,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text)
);


create table "public"."file_tags" (
    "id" bigint generated by default as identity not null,
    "file_id" uuid not null,
    "tag_id" bigint not null
);


create table "public"."tags" (
    "id" bigint generated by default as identity not null,
    "tag" text not null,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text)
);


CREATE UNIQUE INDEX file_annotations_pkey ON public.file_annotations USING btree (id);

CREATE UNIQUE INDEX file_descriptions_pkey ON public.file_descriptions USING btree (id);

CREATE UNIQUE INDEX file_tags_pkey ON public.file_tags USING btree (id);

CREATE UNIQUE INDEX files_id_key ON public.files USING btree (id);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

alter table "public"."file_annotations" add constraint "file_annotations_pkey" PRIMARY KEY using index "file_annotations_pkey";

alter table "public"."file_descriptions" add constraint "file_descriptions_pkey" PRIMARY KEY using index "file_descriptions_pkey";

alter table "public"."file_tags" add constraint "file_tags_pkey" PRIMARY KEY using index "file_tags_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."file_annotations" add constraint "public_file_annotations_file_id_fkey" FOREIGN KEY (file_id) REFERENCES files(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."file_annotations" validate constraint "public_file_annotations_file_id_fkey";

alter table "public"."file_descriptions" add constraint "public_file_descriptions_file_id_fkey" FOREIGN KEY (file_id) REFERENCES files(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."file_descriptions" validate constraint "public_file_descriptions_file_id_fkey";

alter table "public"."file_tags" add constraint "public_file_tags_file_id_fkey" FOREIGN KEY (file_id) REFERENCES files(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."file_tags" validate constraint "public_file_tags_file_id_fkey";

alter table "public"."file_tags" add constraint "public_file_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."file_tags" validate constraint "public_file_tags_tag_id_fkey";

alter table "public"."files" add constraint "files_id_key" UNIQUE using index "files_id_key";

grant delete on table "public"."file_annotations" to "anon";

grant insert on table "public"."file_annotations" to "anon";

grant references on table "public"."file_annotations" to "anon";

grant select on table "public"."file_annotations" to "anon";

grant trigger on table "public"."file_annotations" to "anon";

grant truncate on table "public"."file_annotations" to "anon";

grant update on table "public"."file_annotations" to "anon";

grant delete on table "public"."file_annotations" to "authenticated";

grant insert on table "public"."file_annotations" to "authenticated";

grant references on table "public"."file_annotations" to "authenticated";

grant select on table "public"."file_annotations" to "authenticated";

grant trigger on table "public"."file_annotations" to "authenticated";

grant truncate on table "public"."file_annotations" to "authenticated";

grant update on table "public"."file_annotations" to "authenticated";

grant delete on table "public"."file_annotations" to "service_role";

grant insert on table "public"."file_annotations" to "service_role";

grant references on table "public"."file_annotations" to "service_role";

grant select on table "public"."file_annotations" to "service_role";

grant trigger on table "public"."file_annotations" to "service_role";

grant truncate on table "public"."file_annotations" to "service_role";

grant update on table "public"."file_annotations" to "service_role";

grant delete on table "public"."file_descriptions" to "anon";

grant insert on table "public"."file_descriptions" to "anon";

grant references on table "public"."file_descriptions" to "anon";

grant select on table "public"."file_descriptions" to "anon";

grant trigger on table "public"."file_descriptions" to "anon";

grant truncate on table "public"."file_descriptions" to "anon";

grant update on table "public"."file_descriptions" to "anon";

grant delete on table "public"."file_descriptions" to "authenticated";

grant insert on table "public"."file_descriptions" to "authenticated";

grant references on table "public"."file_descriptions" to "authenticated";

grant select on table "public"."file_descriptions" to "authenticated";

grant trigger on table "public"."file_descriptions" to "authenticated";

grant truncate on table "public"."file_descriptions" to "authenticated";

grant update on table "public"."file_descriptions" to "authenticated";

grant delete on table "public"."file_descriptions" to "service_role";

grant insert on table "public"."file_descriptions" to "service_role";

grant references on table "public"."file_descriptions" to "service_role";

grant select on table "public"."file_descriptions" to "service_role";

grant trigger on table "public"."file_descriptions" to "service_role";

grant truncate on table "public"."file_descriptions" to "service_role";

grant update on table "public"."file_descriptions" to "service_role";

grant delete on table "public"."file_tags" to "anon";

grant insert on table "public"."file_tags" to "anon";

grant references on table "public"."file_tags" to "anon";

grant select on table "public"."file_tags" to "anon";

grant trigger on table "public"."file_tags" to "anon";

grant truncate on table "public"."file_tags" to "anon";

grant update on table "public"."file_tags" to "anon";

grant delete on table "public"."file_tags" to "authenticated";

grant insert on table "public"."file_tags" to "authenticated";

grant references on table "public"."file_tags" to "authenticated";

grant select on table "public"."file_tags" to "authenticated";

grant trigger on table "public"."file_tags" to "authenticated";

grant truncate on table "public"."file_tags" to "authenticated";

grant update on table "public"."file_tags" to "authenticated";

grant delete on table "public"."file_tags" to "service_role";

grant insert on table "public"."file_tags" to "service_role";

grant references on table "public"."file_tags" to "service_role";

grant select on table "public"."file_tags" to "service_role";

grant trigger on table "public"."file_tags" to "service_role";

grant truncate on table "public"."file_tags" to "service_role";

grant update on table "public"."file_tags" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

