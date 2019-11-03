---
layout: "post"
title: "SharePoint Field Schema XML Examples"
date: "2017-12-31"
description: ""
feature_image: ""
tags: [field]
---

This post will give examples of SharePoint field schema xml. _Reference for [field schema](https://msdn.microsoft.com/en-us/library/office/aa979575.aspx)_

<!--more-->

## Field Types

### Boolean

```
<Field ID="{GUID}" Name="Boolean" StaticName="Boolean" DisplayName="Boolean" Type="Boolean">
    <Default>0</Default>
</Field>

```

##### Default Values

```
* 0 - Unchecked
* 1 - Checked

```

### Calculated

```
<Field ID="{GUID}" Name="Calculated" StaticName="Calculated" DisplayName="Calculated" Type="Calculated" ResultType="Text">
    <Formula>=[{Field Title}]</Formula>
    <FieldRefs>
        <FieldRef Name="{Internal Field Name}" />
    </FieldRefs>
</Field>

```

_Refrence for [calculated field formulas](https://msdn.microsoft.com/en-us/library/office/bb862071(v=office.14).aspx)._ _The formula's field value is the title (display name) within brackets \[\]._ _Each field used in the formula, must have the internal name defined within the "FieldRefs"._

##### Result Types

- Boolean
- Currency
- DateTime
    
    - Set the _Format_ property to define "DateOnly" or "DateTime"
- Number
- Text

#### Example Formulas

##### Display another field

_Result Type - Text_

```
<Formula>=[Title]</Formula>
<FieldRefs>
    <FieldRef Name="Title" />
</FieldRefs>

```

##### Display the # of days including hours and minutes

_Result Type - DateTime_

```
<Formula>
=If(
    OR(ISBLANK([Date/Time Opened]),ISBLANK([Date/Time Closed])),
    "",
    DATEDIF([Date/Time Opened), [Date/Time Closed], "d")&":"&Text([Date/Time Closed]-[Date/Time Opened], "hh:mm")
)
</Formula
<FieldRefs>
    <FieldRef Name="EndDate" />
    <FieldRef Name="StartDate" />
</FieldRefs>

```

##### Active flag, based on a status field value

_Result Type - Boolean_

```
<Formula>
=IF(
    OR([Report Status]="In Progress"), [Report Status]="Pending", [Report Status]="Needs Update"),
    "Yes",
    "No"
)
</Formula>
<FieldRefs>
    <FieldRef Name="Status" />
</FieldRefs>

```

### Choice

```
<Field ID="{GUID}" Name="Choice" StaticName="Choice" DisplayName="Choice" Type="Choice">
    <Default>Choice 3</Default>
    <CHOICES>
        <CHOICE>Choice 1</CHOICE>
        <CHOICE>Choice 2</CHOICE>
        <CHOICE>Choice 3</CHOICE>
        <CHOICE>Choice 4</CHOICE>
        <CHOICE>Choice 5</CHOICE>
    </CHOICES>
</Field>

```

### Choice (Multi)

```
<Field ID="{GUID}" Name="Choice" StaticName="Choice" DisplayName="Choice" Type="MultiChoice">
    <Default>Choice 3</Default>
    <CHOICES>
        <CHOICE>Choice 1</CHOICE>
        <CHOICE>Choice 2</CHOICE>
        <CHOICE>Choice 3</CHOICE>
        <CHOICE>Choice 4</CHOICE>
        <CHOICE>Choice 5</CHOICE>
    </CHOICES>
</Field>

```

### Date Only

```
<Field ID="{GUID}" Name="DateOnly" StaticName="DateOnly" DisplayName="Date Only" Type="DateTime" Format="DateOnly" />

```

### Date And Time

```
<Field ID="{GUID}" Name="DateTime" StaticName="DateTime" DisplayName="Date Time" Type="DateTime" Format="DateTime" />

```

### Lookup

```
<Field ID="{GUID}" Name="Lookup" StaticName="Lookup" DisplayName="Lookup" Type="Lookup" List="{Lookup List GUID}" ShowField="[Lookup Internal Field Name]" />

```

- List - The look up list id
- ShowField - The look up list's internal field name.

### Lookup (Associated)

```
<Field ID="{GUID}" Name="AssociatedLookup" StaticName="AssociatedLookup" DisplayName="Associated Lookup" Type="Lookup" List="{Lookup List GUID}" ShowField="[Lookup Internal Field Name]" FieldRef={Lookup Field GUID} />

```

_**Order Matters** - The main lookup field must be created before the associated field._ \* FieldRef - The main lookup field id

### Lookup (Multi)

```
<Field ID="{GUID}" Name="Lookup" StaticName="Lookup" DisplayName="Lookup" Type="Lookup" List="{Lookup List GUID}" ShowField="[Lookup Internal Field Name]" Mult="TRUE" />

```

### Managed Metadata

```
<Field ID="{GUID}" Name="MangedMetadata_0" StaticName="MangedMetadata_0" DisplayName="Manged Metadata Value" Type="Note" Hidden="TRUE" />
<Field ID="{GUID}" Name="MangedMetadata" StaticName="MangedMetadata" DisplayName="Manged Metadata" Type="TaxonomyFieldType" ShowField="Term1033">
    <Customization>
        <ArrayOfProperty>
            <Property>
                <Name>TextField</Name>
                <Value xmlns:q6="http://www.w3.org/2001/XMLSchema" p4:type="q6:string" xmlns:p4="http://www.w3.org/2001/XMLSchema-instance">{Field Value GUID}</Value>
            </Property>
            </ArrayOfProperty>
    </Customization>
</Field>

```

_**Order Matters** - The value field must be created before the managed metadata field._ \* ShowField - Term\[The locale id\] \* 1033 - English

### Note

```
<Field ID="{GUID}" Name="PlainText" StaticName="PlainText" DisplayName="Plain Text" Type="Note" NumLines="6" />

```

### Note (Rich HTML)

```
<Field ID="{GUID}" Name="RichText" StaticName="RichText" DisplayName="Rich Text" Type="Note" RichText="TRUE" />

```

### Note (Enhanced Rich HTML)

```
<Field ID="{GUID}" Name="EnhancedRichText" StaticName="EnhancedPlainText" DisplayName="Enhanced Rich Text" Type="Note" RichText="TRUE" RichTextMode="FullHtml" />

```

### Number (Decimal)

```
<Field ID="{GUID}" Name="NumberDecimal" StaticName="NumberDecimal" DisplayName="Decimal" Type="Number" Decimals="2" Min="-500" Max="500" />

```

- Max - The maximum required value
- Min - The minimum required value

### Number (Integer)

```
<Field ID="{GUID}" Name="NumberInteger" StaticName="NumberInteger" DisplayName="Integer" Type="Number" />

```

### Number (Percentage)

```
<Field ID="{GUID}" Name="NumberPercentage" StaticName="NumberPercentage" DisplayName="Integer" Type="Number" ShowPercentage="TRUE" />

```

### Url

```
<Field ID="{GUID}" Name="Url" StaticName="Url" DisplayName="Url" Type="URL" />

```

### User

```
<Field ID="{GUID}" Name="User" StaticName="User" DisplayName="User" Type="User" UserSelectionMode="0" UserSelectionScope="0" />

```

##### User Selection Mode

```
* 0 - Users Only
* 1 - User & Groups

```

##### User Selection Scope

```
* 0 - No Restrictions
* [#] - The SharePoint group id

```

### User (Multi)

```
<Field ID="{GUID}" Name="User" StaticName="User" DisplayName="User" Type="User" UserSelectionMode="0" UserSelectionScope="0" Mult="TRUE" />

```
