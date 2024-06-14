from enum import Enum
from typing import Optional
from pydantic import BaseModel


class AnnotationCategory(str, Enum):
    EXPLICIT_OBJECTS_AND_SCENES = "explicit_objects_and_scenes"
    ACTIVITIES_AND_ACTIONS = "activities_and_actions"
    ENTITIES_AND_INDIVIDUALS = "entities_and_individuals"
    EMOTIONS_AND_EXPRESSIONS = "emotions_and_expressions"
    COMPOSITION_AND_STYLE = "composition_and_style"
    ABSTRACT_AND_CONCEPTUAL = "abstract_and_conceptual"
    TYPES_OF_MEDIA = "types_of_media"
    CONTEXTUAL_INFORMATION = "contextual_information"


class ExplicitObjectsAndScenesSubcategory(str, Enum):
    OBJECTS = "objects"
    PEOPLE = "people"
    ANIMALS = "animals"
    LOCATIONS = "locations"
    NATURAL_ELEMENTS = "natural_elements"


class ActivitiesAndActionsSubcategory(str, Enum):
    ACTIONS = "actions"
    INTERACTIONS = "interactions"
    EVENTS = "events"


class EntitiesAndIndividualsSubcategory(str, Enum):
    NAMED_INDIVIDUALS = "named_individuals"
    ORGANIZATIONS = "organizations"
    LANDMARKS = "landmarks"
    BRANDS = "brands"


class EmotionsAndExpressionsSubcategory(str, Enum):
    EMOTIONS = "emotions"
    EXPRESSIONS = "expressions"
    MOOD = "mood"


class CompositionAndStyleSubcategory(str, Enum):
    COMPOSITION = "composition"
    STYLE = "style"
    LIGHTING = "lighting"
    COLOR = "color"


class AbstractAndConceptualSubcategory(str, Enum):
    THEMES = "themes"
    CONCEPTS = "concepts"
    SYMBOLISM = "symbolism"


class TypesOfMediaSubcategory(str, Enum):
    PHOTOGRAPHY = "photography"
    ART_AND_ILLUSTRATIONS = "art_and_illustrations"
    DOCUMENTS_AND_TEXT = "documents_and_text"
    SCREENSHOTS = "screenshots"
    VIDEOS = "videos"


class ContextualInformationSubcategory(str, Enum):
    TIME = "time"
    LOCATION = "location"
    PURPOSE = "purpose"


class Annotation(BaseModel):
    category: AnnotationCategory
    sub_category: Optional[str] = None
    detail: Optional[str] = None
    value: str

    class Config:
        use_enum_values = True
